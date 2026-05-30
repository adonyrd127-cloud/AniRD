package com.example.anird.tv.presenter

import androidx.leanback.widget.AbstractDetailsDescriptionPresenter
import com.example.anird.data.model.Anime

/**
 * Presentador Leanback para los detalles descriptivos en la pantalla de info de un anime.
 * Extiende AbstractDetailsDescriptionPresenter para heredar comportamiento TV nativo.
 */
class DetailsDescriptionPresenter : AbstractDetailsDescriptionPresenter() {

    override fun onBindDescription(viewHolder: ViewHolder, item: Any) {
        val anime = item as Anime
        
        viewHolder.title.text = anime.displayTitle
        
        val subtitleParts = mutableListOf<String>()
        anime.type?.let { subtitleParts.add(it) }
        anime.year?.let { subtitleParts.add(it.toString()) }
        anime.score?.let { subtitleParts.add("★ %.1f".format(it)) }
        
        viewHolder.subtitle.text = subtitleParts.joinToString(" • ")
        
        val synopsis = anime.synopsis?.takeIf { it.isNotBlank() } ?: "Sin sinopsis disponible."
        if (anime.nextEpisodeDate != null) {
            viewHolder.body.text = "¡Próximo! ${anime.nextEpisodeDate}\n\n$synopsis"
        } else {
            viewHolder.body.text = synopsis
        }
    }
}
