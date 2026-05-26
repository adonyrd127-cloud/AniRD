# Preservar clases con @JavascriptInterface (bridge JS<->Kotlin)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preservar el bridge de AniRD específicamente
-keep class com.example.anird.MainActivity$JsBridge { *; }
-keep class com.example.anird.MainActivity$JsBridge$* { *; }

# WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# Media Session
-keep class androidx.media.** { *; }
-keep class android.support.v4.media.** { *; }
