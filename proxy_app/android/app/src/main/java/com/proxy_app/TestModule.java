package com.proxy_app;

import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class TestModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public TestModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "TestModule";
    }

    @ReactMethod
    public void show(String text, int time) {
        Toast.makeText(this.reactContext, text, time).show();
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("LENG_LONG", Toast.LENGTH_LONG);
        return constants;
    }
}
