package com.example.anird.tv

import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import com.example.anird.R

/**
 * Actividad contenedora para la funcionalidad de búsqueda en Android TV.
 * Carga e inicializa el TvSearchFragment.
 */
class TvSearchActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.tv_activity_search)
    }
}
