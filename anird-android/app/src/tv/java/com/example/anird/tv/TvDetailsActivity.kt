package com.example.anird.tv

import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import com.example.anird.R

/**
 * Actividad contenedora de detalles de Anime para Android TV.
 * Carga e inicializa el TvDetailsFragment.
 */
class TvDetailsActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.tv_activity_details)
    }
}
