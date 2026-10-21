package com.devqii.groove66.equalizer

import android.media.audiofx.Equalizer
import android.util.Log
import com.facebook.react.bridge.*
import android.media.audiofx.AudioEffect

/**
 * Groove '66 Native 1960s Hi-Fi Audio Equalizer Module
 * Wraps android.media.audiofx.Equalizer attached directly to the active
 * ExoPlayer AudioTrack audio session ID.
 */
class GrooveEqualizerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var equalizer: Equalizer? = null
    private var currentSessionId: Int = 0
    private var isEnabledState: Boolean = false
    private var minLevelMilliBels: Short = -1500
    private var maxLevelMilliBels: Short = 1500
    private var numBandsCount: Short = 5
    private val bandLevelsMap = mutableMapOf<Short, Short>()

    companion object {
        const val TAG = "GrooveEqualizer"
        const val MODULE_NAME = "GrooveEqualizer"
    }

    override fun getName(): String = MODULE_NAME

    /**
     * Check if Equalizer audio effects are supported on this device
     */
    @Synchronized
    @ReactMethod
    fun isSupported(promise: Promise) {
        try {
            promise.resolve(AudioEffect.queryEffects()?.any { it.type == AudioEffect.EFFECT_TYPE_EQUALIZER } == true)
        } catch (e: Throwable) {
            Log.w(TAG, "Equalizer not supported on this platform: ${e.message}")
            promise.resolve(false)
        }
    }

    /**
     * Attach native Equalizer to a specific audio session ID (from ExoPlayer)
     */
    @Synchronized
    @ReactMethod
    fun attachToSession(sessionId: Int, promise: Promise) {
        try {
            val result = attachInternal(sessionId)
            promise.resolve(result)
        } catch (e: Throwable) {
            cleanup()
            Log.e(TAG, "Failed to attach Equalizer to session $sessionId: ${e.message}", e)
            val fallbackMap = Arguments.createMap().apply {
                putBoolean("success", false)
                putBoolean("isSupported", false)
                putInt("sessionId", sessionId)
                putString("error", e.message ?: "Unknown error")
            }
            promise.resolve(fallbackMap)
        }
    }

    private fun attachInternal(sessionId: Int): WritableMap {
        if (sessionId <= 0) {
            val map = Arguments.createMap().apply {
                putBoolean("success", false)
                putBoolean("isSupported", false)
                putInt("sessionId", sessionId)
                putString("error", "Invalid audio session ID: $sessionId")
            }
            return map
        }

        // Release previous instance if existing
        if (equalizer != null) {
            try {
                equalizer?.release()
            } catch (e: Throwable) {
                Log.w(TAG, "Error releasing previous equalizer: ${e.message}")
            }
            equalizer = null
        }

        currentSessionId = 0
        Log.i(TAG, "Instantiating native Equalizer(priority=0, audioSessionId=$sessionId)...")
        val newEq = Equalizer(0, sessionId)
        equalizer = newEq
        currentSessionId = sessionId

        // Query real hardware capabilities
        numBandsCount = newEq.numberOfBands
        val range = newEq.bandLevelRange
        if (range != null && range.size >= 2) {
            minLevelMilliBels = range[0]
            maxLevelMilliBels = range[1]
        }

        // Re-apply stored band levels or initialize to 0 mB (flat)
        for (i in 0 until numBandsCount) {
            val bandIndex = i.toShort()
            val targetLevel = bandLevelsMap[bandIndex] ?: 0.toShort()
            val clamped = targetLevel.coerceIn(minLevelMilliBels, maxLevelMilliBels)
            try {
                newEq.setBandLevel(bandIndex, clamped)
                bandLevelsMap[bandIndex] = clamped
            } catch (e: Throwable) {
                Log.w(TAG, "Failed setting initial band $i level: ${e.message}")
            }
        }

        // Apply enabled state
        try {
            newEq.enabled = isEnabledState
        } catch (e: Throwable) {
            Log.w(TAG, "Failed setting enabled state on equalizer: ${e.message}")
        }

        Log.i(
            TAG,
            "Native Equalizer successfully attached to session $sessionId! " +
                    "Bands: $numBandsCount, Range: [$minLevelMilliBels, $maxLevelMilliBels] mB, " +
                    "Enabled: $isEnabledState"
        )

        return buildParametersMap(true)
    }

    /**
     * Enable or bypass native Equalizer DSP
     */
    @Synchronized
    @ReactMethod
    fun setEnabled(enabled: Boolean, promise: Promise) {
        isEnabledState = enabled
        try {
            equalizer?.let {
                it.enabled = enabled
                Log.i(TAG, "Equalizer enabled set to $enabled on session $currentSessionId")
            }
            val res = Arguments.createMap().apply {
                putBoolean("success", true)
                putBoolean("enabled", isEnabledState)
                putInt("sessionId", currentSessionId)
            }
            promise.resolve(res)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to set enabled=$enabled on equalizer: ${e.message}", e)
            val res = Arguments.createMap().apply {
                putBoolean("success", false)
                putBoolean("enabled", isEnabledState)
                putString("error", e.message ?: "Failed setting enabled")
            }
            promise.resolve(res)
        }
    }

    @Synchronized
    @ReactMethod
    fun isEnabled(promise: Promise) {
        val actual = equalizer?.enabled ?: isEnabledState
        promise.resolve(actual)
    }

    /**
     * Set a specific frequency band level in millibels (mB)
     * e.g. +300 mB = +3.0 dB, -200 mB = -2.0 dB
     */
    @Synchronized
    @ReactMethod
    fun setBandLevel(band: Int, levelMilliBels: Int, promise: Promise) {
        try {
            require(band >= 0 && band < numBandsCount) { "Invalid equalizer band $band" }
            val bandShort = band.toShort()
            val clamped = levelMilliBels.coerceIn(minLevelMilliBels.toInt(), maxLevelMilliBels.toInt()).toShort()
            bandLevelsMap[bandShort] = clamped

            equalizer?.let {
                it.setBandLevel(bandShort, clamped)
                Log.d(TAG, "Native band $band set to $clamped mB")
            }

            val res = Arguments.createMap().apply {
                putBoolean("success", true)
                putInt("band", band)
                putInt("level", clamped.toInt())
            }
            promise.resolve(res)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed setting band $band level to $levelMilliBels: ${e.message}", e)
            val res = Arguments.createMap().apply {
                putBoolean("success", false)
                putInt("band", band)
                putString("error", e.message ?: "Failed setting band level")
            }
            promise.resolve(res)
        }
    }

    /**
     * Set all bands at once using an array of millibel values
     */
    @Synchronized
    @ReactMethod
    fun setAllBandLevels(levels: ReadableArray, promise: Promise) {
        try {
            val count = levels.size().coerceAtMost(numBandsCount.toInt())
            for (i in 0 until count) {
                val level = levels.getInt(i)
                val bandShort = i.toShort()
                val clamped = level.coerceIn(minLevelMilliBels.toInt(), maxLevelMilliBels.toInt()).toShort()
                bandLevelsMap[bandShort] = clamped
                equalizer?.setBandLevel(bandShort, clamped)
            }
            Log.i(TAG, "Native setAllBandLevels updated $count bands on session $currentSessionId")
            val res = Arguments.createMap().apply {
                putBoolean("success", true)
                putInt("count", count)
            }
            promise.resolve(res)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed setting all band levels: ${e.message}", e)
            val res = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("error", e.message ?: "Failed setting all bands")
            }
            promise.resolve(res)
        }
    }

    /**
     * Return all equalizer parameters, real hardware bands, and gain limits
     */
    @Synchronized
    @ReactMethod
    fun getParameters(promise: Promise) {
        try {
            val map = buildParametersMap(equalizer != null)
            promise.resolve(map)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed reading parameters: ${e.message}", e)
            promise.reject("GET_PARAMS_ERROR", e.message ?: "Unknown error")
        }
    }

    private fun buildParametersMap(attached: Boolean): WritableMap {
        val map = Arguments.createMap()
        map.putBoolean("success", attached)
        map.putBoolean("isSupported", attached)
        map.putBoolean("attached", attached)
        map.putInt("sessionId", currentSessionId)
        map.putBoolean("enabled", equalizer?.enabled ?: isEnabledState)
        map.putInt("numberOfBands", numBandsCount.toInt())
        map.putInt("minLevel", minLevelMilliBels.toInt())
        map.putInt("maxLevel", maxLevelMilliBels.toInt())

        val bandsArray = Arguments.createArray()
        for (i in 0 until (if (attached) numBandsCount.toInt() else 0)) {
            val bandIndex = i.toShort()
            val bandMap = Arguments.createMap()
            bandMap.putInt("index", i)

            val centerFreqMilliHz = equalizer!!.getCenterFreq(bandIndex)
            val centerFreqHz = centerFreqMilliHz / 1000
            bandMap.putInt("centerFreq", centerFreqHz)

            val levelMilliBels = equalizer?.getBandLevel(bandIndex)
                ?: (bandLevelsMap[bandIndex] ?: 0.toShort())
            bandMap.putInt("level", levelMilliBels.toInt())

            bandsArray.pushMap(bandMap)
        }
        map.putArray("bands", bandsArray)

        // Native hardware presets
        val presetsArray = Arguments.createArray()
        equalizer?.let { eq ->
            try {
                val numPresets = eq.numberOfPresets
                for (p in 0 until numPresets) {
                    val pName = eq.getPresetName(p.toShort())
                    presetsArray.pushString(pName)
                }
            } catch (e: Throwable) {
                // Presets query optional
            }
        }
        map.putArray("nativePresets", presetsArray)

        return map
    }

    /**
     * Release equalizer resources on shutdown
     */
    @Synchronized
    @ReactMethod
    fun release(promise: Promise) {
        try {
            cleanup()
            Log.i(TAG, "Native Equalizer released.")
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("RELEASE_ERROR", e.message ?: "Failed releasing equalizer")
        }
    }
    @Synchronized
    private fun cleanup() {
        val previous = equalizer
        equalizer = null
        currentSessionId = 0
        try { previous?.release() } catch (e: Throwable) {
            Log.w(TAG, "Equalizer release failed: ${e.message}")
        }
    }

    @Synchronized
    override fun invalidate() {
        cleanup()
        super.invalidate()
    }

}
