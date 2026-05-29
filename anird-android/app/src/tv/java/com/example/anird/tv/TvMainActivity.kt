package com.example.anird.tv

import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope
import com.example.anird.R
import kotlinx.coroutines.launch

/**
 * Actividad de inicio principal para Android TV.
 * Carga el TvBrowseFragment y coordina la sincronización silenciosa inicial con el servidor.
 */
class TvMainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.tv_activity_main)

        // Sincronización en segundo plano silenciosa con el servidor al iniciar
        val authRepo = TvRepositoryProvider.getAuthRepository(this)
        if (authRepo.isLoggedIn) {
            lifecycleScope.launch {
                runCatching {
                    authRepo.syncFromServerFull()
                    authRepo.syncToServer()
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Cuando regrese del Login, recrea para reflejar el cambio de estado de sesión
        val authRepo = TvRepositoryProvider.getAuthRepository(this)
        val shouldRefresh = intent.getBooleanExtra("should_refresh", false)
        if (shouldRefresh) {
            intent.removeExtra("should_refresh")
            recreate()
        }
    }
}
