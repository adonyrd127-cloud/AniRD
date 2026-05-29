package com.example.anird.tv.presenter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.leanback.widget.Presenter
import com.bumptech.glide.Glide
import com.example.anird.R
import com.example.anird.data.model.Episode

/**
 * Presentador Leanback para tarjetas de episodios (16:9 aspect ratio).
 * Carga miniaturas de episodios con Glide, renderiza la barra de progreso de visualización,
 * muestra un badge de "VISTO" y aplica un efecto premium de escala y borde naranja al obtener foco.
 */
class EpisodePresenter : Presenter() {

    override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.tv_item_episode, parent, false)

        // Animación dinámica de foco premium
        view.setOnFocusChangeListener { v, hasFocus ->
            val border = v.findViewById<View>(R.id.focus_border)
            if (hasFocus) {
                border.visibility = View.VISIBLE
                v.animate()
                    .scaleX(1.08f)
                    .scaleY(1.08f)
                    .translationZ(8f)
                    .setDuration(150)
                    .start()
            } else {
                border.visibility = View.INVISIBLE
                v.animate()
                    .scaleX(1.0f)
                    .scaleY(1.0f)
                    .translationZ(0f)
                    .setDuration(150)
                    .start()
            }
        }

        return Presenter.ViewHolder(view)
    }

    override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
        val ep = item as? Episode ?: return
        val v = viewHolder.view

        val titleText = v.findViewById<TextView>(R.id.episode_title)
        val subtitleText = v.findViewById<TextView>(R.id.episode_subtitle)
        val thumbnail = v.findViewById<ImageView>(R.id.episode_thumbnail)
        val progress = v.findViewById<ProgressBar>(R.id.episode_progress)
        val watchedBadge = v.findViewById<TextView>(R.id.episode_watched_badge)

        titleText.text = ep.displayTitle
        
        if (!ep.title.isNullOrBlank() && ep.title != ep.displayTitle) {
            subtitleText.text = ep.title
            subtitleText.visibility = View.VISIBLE
        } else {
            subtitleText.visibility = View.GONE
        }

        // Carga de miniatura con fallback elegante a banner por defecto
        Glide.with(v.context)
            .load(ep.thumbnailUrl)
            .placeholder(R.drawable.tv_banner)
            .error(R.drawable.tv_banner)
            .centerCrop()
            .into(thumbnail)

        // Barra de progreso interactiva
        if (ep.progressMs > 0 && ep.durationMs > 0) {
            progress.visibility = View.VISIBLE
            progress.max = 100
            progress.progress = ep.progressPercent.toInt()
        } else {
            progress.visibility = View.GONE
        }

        // Badge de Visto
        if (ep.watched || ep.isComplete) {
            watchedBadge.visibility = View.VISIBLE
        } else {
            watchedBadge.visibility = View.GONE
        }
    }

    override fun onUnbindViewHolder(viewHolder: Presenter.ViewHolder) {
        val thumbnail = viewHolder.view.findViewById<ImageView>(R.id.episode_thumbnail)
        thumbnail.setImageDrawable(null)
    }
}
