package com.example.anird.tv.presenter

import android.view.ViewGroup
import android.widget.ImageView
import androidx.core.content.ContextCompat
import androidx.leanback.widget.BaseCardView
import androidx.leanback.widget.ImageCardView
import androidx.leanback.widget.Presenter
import com.bumptech.glide.Glide
import com.example.anird.R
import com.example.anird.data.model.Anime

/**
 * Presentador Leanback para tarjetas de anime (2:3 aspect ratio).
 * Implementa Glide para carga rápida de posters, y efectos de selección de color.
 */
class AnimeCardPresenter : Presenter() {

    override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
        val cardView = object : ImageCardView(parent.context) {
            override fun setSelected(selected: Boolean) {
                super.setSelected(selected)
                // Color de fondo dinámico de la tarjeta según el foco
                if (selected) {
                    setBackgroundColor(ContextCompat.getColor(context, R.color.tv_primary))
                } else {
                    setBackgroundColor(ContextCompat.getColor(context, R.color.tv_surface_card))
                }
            }
        }
        cardView.isFocusable = true
        cardView.isFocusableInTouchMode = true

        val width = parent.resources.getDimensionPixelSize(R.dimen.tv_card_width)
        val height = parent.resources.getDimensionPixelSize(R.dimen.tv_card_height)
        cardView.setMainImageDimensions(width, height)
        cardView.cardType = BaseCardView.CARD_TYPE_INFO_UNDER_WITH_EXTRA

        // Estilos del texto
        cardView.infoAreaBackground = ContextCompat.getDrawable(parent.context, R.color.tv_surface_card)

        return Presenter.ViewHolder(cardView)
    }

    override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
        val anime = item as? Anime ?: return
        val cardView = viewHolder.view as ImageCardView

        cardView.titleText = anime.displayTitle
        
        val infoList = mutableListOf<String>()
        anime.type?.let { infoList.add(it) }
        anime.year?.let { infoList.add(it.toString()) }
        cardView.contentText = infoList.joinToString(" • ")

        // Mostramos el puntaje en la sección "extra"
        anime.score?.let {
            cardView.badgeImage = null
        }

        Glide.with(viewHolder.view.context)
            .load(anime.imageUrl)
            .centerCrop()
            .into(cardView.mainImageView ?: return)
    }

    override fun onUnbindViewHolder(viewHolder: Presenter.ViewHolder) {
        val cardView = viewHolder.view as ImageCardView
        cardView.mainImageView?.setImageDrawable(null)
    }
}
