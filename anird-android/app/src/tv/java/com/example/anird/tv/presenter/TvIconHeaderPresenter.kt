package com.example.anird.tv.presenter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.leanback.widget.HeaderItem
import androidx.leanback.widget.ListRow
import androidx.leanback.widget.Presenter
import androidx.leanback.widget.RowHeaderPresenter
import com.example.anird.R

class TvIconHeaderItem(id: Long, name: String, val iconResId: Int) : HeaderItem(id, name)

class TvIconHeaderPresenter : RowHeaderPresenter() {

    override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.tv_header_item, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
        val headerItem = if (item is ListRow) item.headerItem else item as? HeaderItem
        val view = viewHolder.view
        val iconView = view.findViewById<ImageView>(R.id.header_icon)
        val labelView = view.findViewById<TextView>(R.id.header_label)

        if (headerItem is TvIconHeaderItem) {
            if (headerItem.iconResId != 0) {
                iconView.setImageResource(headerItem.iconResId)
                iconView.visibility = View.VISIBLE
            } else {
                iconView.visibility = View.GONE
            }
        } else {
            iconView.visibility = View.GONE
        }
        
        labelView.text = headerItem?.name
    }

    override fun onUnbindViewHolder(viewHolder: Presenter.ViewHolder) {
        // Nada específico
    }

    override fun onSelectLevelChanged(holder: RowHeaderPresenter.ViewHolder) {
        val view = holder.view
        val iconView = view.findViewById<ImageView>(R.id.header_icon)
        val labelView = view.findViewById<TextView>(R.id.header_label)
        
        val activeColor = ContextCompat.getColor(view.context, R.color.tv_primary)
        val inactiveColor = ContextCompat.getColor(view.context, R.color.tv_text_secondary)
        val textActiveColor = ContextCompat.getColor(view.context, R.color.tv_text_primary)
        
        // El selectLevel va de 0.0f (no seleccionado) a 1.0f (seleccionado)
        val isSelected = holder.selectLevel > 0.5f
        
        if (isSelected) {
            iconView.setColorFilter(activeColor)
            labelView.setTextColor(textActiveColor)
            view.alpha = 1.0f
        } else {
            iconView.setColorFilter(inactiveColor)
            labelView.setTextColor(inactiveColor)
            view.alpha = holder.unselectLevel // Permite el fade original de leanback
        }
    }
}
