plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.compose.compiler)
  alias(libs.plugins.kotlin.serialization)
  alias(libs.plugins.ksp)
  alias(libs.plugins.hilt)
}

android {
    namespace = "com.example.anird"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.example.anird"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    flavorDimensions += "environment"

    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            versionNameSuffix = "-dev"
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:3000\"")
            buildConfigField("Boolean", "ENABLE_WEBVIEW_DEBUG", "true")
            buildConfigField("Boolean", "IS_TV", "false")
            buildConfigField("String", "LOCAL_API_URL", "\"http://10.0.2.2:3000/api/v1/\"")
            buildConfigField("String", "JIKAN_BASE_URL", "\"https://api.jikan.moe/v4/\"")
            buildConfigField("String", "ANILIST_URL", "\"https://graphql.anilist.co/\"")
            buildConfigField("String", "API_KEY", "\"dev-anime1v-key\"")
        }
        create("prod") {
            dimension = "environment"
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.0.9:3005\"")
            buildConfigField("Boolean", "ENABLE_WEBVIEW_DEBUG", "false")
            buildConfigField("Boolean", "IS_TV", "false")
            buildConfigField("String", "LOCAL_API_URL", "\"http://10.0.0.9:3005/api/v1/\"")
            buildConfigField("String", "JIKAN_BASE_URL", "\"https://api.jikan.moe/v4/\"")
            buildConfigField("String", "ANILIST_URL", "\"https://graphql.anilist.co/\"")
            buildConfigField("String", "API_KEY", "\"dev-anime1v-key\"")
        }
        create("tv") {
            dimension = "environment"
            applicationIdSuffix = ".tv"
            versionNameSuffix = "-tv"
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.0.9:3005\"")
            buildConfigField("Boolean", "ENABLE_WEBVIEW_DEBUG", "false")
            buildConfigField("Boolean", "IS_TV", "true")
            buildConfigField("String", "LOCAL_API_URL", "\"http://10.0.0.9:3005/api/v1/\"")
            buildConfigField("String", "JIKAN_BASE_URL", "\"https://api.jikan.moe/v4/\"")
            buildConfigField("String", "ANILIST_URL", "\"https://graphql.anilist.co/\"")
            buildConfigField("String", "API_KEY", "\"dev-anime1v-key\"")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures {
      compose = true
      aidl = false
      buildConfig = true
      shaders = false
      viewBinding = true
    }

    packaging {
      resources {
        excludes += "/META-INF/{AL2.0,LGPL2.1}"
      }
    }
}

kotlin {
    jvmToolchain(17)
}

dependencies {
  val composeBom = platform(libs.androidx.compose.bom)
  implementation(composeBom)
  androidTestImplementation(composeBom)

  // Core Android dependencies
  implementation(libs.androidx.core.ktx)
  implementation(libs.androidx.lifecycle.runtime.ktx)
  implementation(libs.androidx.activity.compose)
  implementation("androidx.compose.material:material-icons-extended")

  // Arch Components
  implementation(libs.androidx.lifecycle.runtime.compose)
  implementation(libs.androidx.lifecycle.viewmodel.compose)

  // Compose
  implementation(libs.androidx.compose.ui)
  implementation(libs.androidx.compose.ui.tooling.preview)
  implementation(libs.androidx.compose.material3)
  implementation("androidx.compose.material:material-icons-core")
  // Tooling
  debugImplementation(libs.androidx.compose.ui.tooling)
  // Instrumented tests
  androidTestImplementation(libs.androidx.compose.ui.test.junit4)
  debugImplementation(libs.androidx.compose.ui.test.manifest)

  // Local tests: jUnit, coroutines, Android runner
  testImplementation(libs.junit)
  testImplementation(libs.kotlinx.coroutines.test)

  // Instrumented tests: jUnit rules and runners
  androidTestImplementation(libs.androidx.test.core)
  androidTestImplementation(libs.androidx.test.ext.junit)
  androidTestImplementation(libs.androidx.test.runner)
  androidTestImplementation(libs.androidx.test.espresso.core)

  // Navigation
  implementation(libs.androidx.navigation3.ui)
  implementation(libs.androidx.navigation3.runtime)
  implementation(libs.androidx.lifecycle.viewmodel.navigation3)

  // Media Session & Native Features
  implementation(libs.androidx.media)
  implementation(libs.androidx.core.splashscreen)
  implementation(libs.androidx.biometric)
  implementation(libs.androidx.security.crypto)
  implementation(libs.androidx.fragment)

  // Android TV Leanback
  implementation(libs.androidx.leanback)

  // Networking
  implementation(libs.retrofit.core)
  implementation(libs.retrofit.gson)
  implementation(libs.okhttp.core)
  implementation(libs.okhttp.logging)
  implementation(libs.gson)

  // Images
  implementation(libs.glide)
  implementation(libs.coil.compose)

  // Database
  implementation(libs.room.runtime)
  implementation(libs.room.ktx)
  ksp(libs.room.compiler)

  // Hilt Dependency Injection
  implementation(libs.hilt.android)
  ksp(libs.hilt.compiler)
  implementation(libs.hilt.navigation.compose)

  // Navigation
  implementation(libs.androidx.navigation.compose)

  // Media3 (ExoPlayer & Session)
  implementation(libs.media3.exoplayer)
  implementation(libs.media3.session)
  implementation(libs.media3.ui)

  // DataStore
  implementation(libs.androidx.datastore.preferences)

  // Paging 3
  implementation(libs.androidx.paging.runtime)
  implementation(libs.androidx.paging.compose)

  // WorkManager
  implementation(libs.androidx.work.runtime.ktx)

  // Coroutines
  implementation(libs.kotlinx.coroutines.android)
}
