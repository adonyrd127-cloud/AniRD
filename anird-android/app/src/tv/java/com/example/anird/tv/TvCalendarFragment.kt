package com.example.anird.tv

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.leanback.app.BrowseSupportFragment
import androidx.leanback.widget.*
import androidx.lifecycle.lifecycleScope
import com.example.anird.R
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.tv.presenter.AnimeCardPresenter
import kotlinx.coroutines.launch
import kotlinx.coroutines.async

class TvCalendarFragment : BrowseSupportFragment() {

    companion object {
        private const val TAG = "TvCalendarFragment"
    }

    private lateinit var animeRepo: AnimeRepository
    private lateinit var rowsAdapter: ArrayObjectAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        animeRepo = TvRepositoryProvider.getAnimeRepository(requireContext())
        
        // Configurar UI para que parezca una pantalla simple de filas (sin barra lateral)
        headersState = HEADERS_DISABLED
        title = "Calendario de Emisiones"
        brandColor = ContextCompat.getColor(requireContext(), R.color.tv_background)
        
        setupAdapter()
        setupListeners()
        loadSchedules()
    }

    private fun setupAdapter() {
        val presenterSelector = ClassPresenterSelector()
        presenterSelector.addClassPresenter(ListRow::class.java, ListRowPresenter())
        rowsAdapter = ArrayObjectAdapter(presenterSelector)
        adapter = rowsAdapter
    }

    private fun setupListeners() {
        setOnItemViewClickedListener { _, item, _, _ ->
            if (item is Anime) {
                val intent = Intent(requireActivity(), TvDetailsActivity::class.java).apply {
                    putExtra("mal_id", item.malId)
                }
                startActivity(intent)
            }
        }
    }

    private fun loadSchedules() {
        lifecycleScope.launch {
            try {
                // Fetch real simulcast seasonal animes (page 1 and 2 to get top 50)
                val page1Deferred = async { runCatching { animeRepo.getLatest(1) }.getOrNull() ?: emptyList() }
                val page2Deferred = async { runCatching { animeRepo.getLatest(2) }.getOrNull() ?: emptyList() }
                val schedules = page1Deferred.await() + page2Deferred.await()
                
                // Agrupar por día (Jikan devuelve broadcast.day en inglés ej: "Mondays")
                val grouped = schedules.groupBy { anime ->
                    val day = anime.broadcast?.day?.lowercase() ?: ""
                    when {
                        day.contains("monday") -> "Lunes"
                        day.contains("tuesday") -> "Martes"
                        day.contains("wednesday") -> "Miércoles"
                        day.contains("thursday") -> "Jueves"
                        day.contains("friday") -> "Viernes"
                        day.contains("saturday") -> "Sábado"
                        day.contains("sunday") -> "Domingo"
                        else -> "Otros"
                    }
                }

                // Orden correcto de días
                val orderedDays = listOf("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", "Otros")
                
                var rowId = 1L
                for (day in orderedDays) {
                    val animesForDay = grouped[day] ?: continue
                    if (animesForDay.isEmpty()) continue
                    
                    val listRowAdapter = ArrayObjectAdapter(AnimeCardPresenter())
                    listRowAdapter.addAll(0, animesForDay)
                    
                    val header = HeaderItem(rowId++, day)
                    rowsAdapter.add(ListRow(header, listRowAdapter))
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error cargando calendario", e)
                Toast.makeText(context, "Error al cargar calendario", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
