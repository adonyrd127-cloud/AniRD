package com.example.anird.tv

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.leanback.app.SearchSupportFragment
import androidx.leanback.widget.*
import androidx.lifecycle.lifecycleScope
import com.example.anird.data.model.Anime
import com.example.anird.data.repository.AnimeRepository
import com.example.anird.tv.presenter.AnimeCardPresenter
import kotlinx.coroutines.launch

/**
 * Fragmento de búsqueda para Android TV que extiende SearchSupportFragment.
 * Integra búsqueda por voz y teclado QWERTY en pantalla nativos de TV.
 * Realiza solicitudes de búsqueda a Jikan API y muestra los resultados en tarjetas interactivas.
 */
class TvSearchFragment : SearchSupportFragment(), SearchSupportFragment.SearchResultProvider {

    private lateinit var animeRepo: AnimeRepository
    private lateinit var rowsAdapter: ArrayObjectAdapter
    private lateinit var resultsAdapter: ArrayObjectAdapter
    
    private val searchHandler = android.os.Handler(android.os.Looper.getMainLooper())
    private var searchRunnable: Runnable? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        animeRepo = TvRepositoryProvider.getAnimeRepository(requireContext())
        
        rowsAdapter = ArrayObjectAdapter(ListRowPresenter())
        resultsAdapter = ArrayObjectAdapter(AnimeCardPresenter())

        val header = HeaderItem(0, "Resultados de búsqueda")
        rowsAdapter.add(ListRow(header, resultsAdapter))

        setSearchResultProvider(this)

        // Clic en los resultados de búsqueda abre detalles del anime
        setOnItemViewClickedListener { _, item, _, _ ->
            if (item is Anime) {
                val intent = Intent(requireActivity(), TvDetailsActivity::class.java).apply {
                    putExtra("mal_id", item.malId)
                }
                startActivity(intent)
            }
        }
    }

    override fun getResultsAdapter(): ObjectAdapter = rowsAdapter

    override fun onQueryTextChange(newQuery: String?): Boolean {
        searchRunnable?.let { searchHandler.removeCallbacks(it) }
        val query = newQuery?.trim() ?: ""
        if (query.length >= 3) {
            searchRunnable = Runnable { performSearch(query) }
            searchHandler.postDelayed(searchRunnable!!, 600L)
        } else if (query.isEmpty()) {
            resultsAdapter.clear()
        }
        return true
    }

    override fun onQueryTextSubmit(query: String?): Boolean {
        searchRunnable?.let { searchHandler.removeCallbacks(it) }
        if (!query.isNullOrBlank()) {
            performSearch(query.trim())
        }
        return true
    }

    private fun performSearch(query: String) {
        resultsAdapter.clear()
        lifecycleScope.launch {
            try {
                val results = animeRepo.searchJikan(query)
                if (results.isNotEmpty()) {
                    resultsAdapter.addAll(0, results)
                } else {
                    Toast.makeText(context, "No se encontraron resultados para '$query'", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Error al buscar: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
