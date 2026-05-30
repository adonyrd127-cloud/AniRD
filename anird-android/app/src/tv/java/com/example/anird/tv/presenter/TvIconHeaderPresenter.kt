package com.example.anird.tv.presenter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.leanback.widget.HeaderItem
import androidx.leanback.widget.ListRow
import androidx.leanback.widget.Row
import androidx.leanback.widget.Presenter
import androidx.leanback.widget.RowHeaderPresenter
import com.bumptech.glide.Glide
import com.example.anird.R

class TvIconHeaderItem(id: Long, name: String, val iconResId: Int) : HeaderItem(id, name)

class TvIconHeaderPresenter(
    private val onCategoriesClicked: () -> Unit,
    private val isExpandedProvider: () -> Boolean
) : RowHeaderPresenter() {

    override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.tv_header_item, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
        val headerItem = (item as? Row)?.headerItem
        val view = viewHolder.view

        val normalContainer = view.findViewById<View>(R.id.normal_header_container)
        val followingContainer = view.findViewById<View>(R.id.following_header_container)
        
        val iconView = view.findViewById<ImageView>(R.id.header_icon)
        val labelView = view.findViewById<TextView>(R.id.header_label)
        val chevronView = view.findViewById<ImageView>(R.id.header_chevron)

        val followingCover = view.findViewById<ImageView>(R.id.following_cover)
        val followingTitle = view.findViewById<TextView>(R.id.following_title)
        val followingSubtitle = view.findViewById<TextView>(R.id.following_subtitle)

        if (headerItem is TvFollowingHeaderItem) {
            normalContainer.visibility = View.GONE
            followingContainer.visibility = View.VISIBLE
            
            followingTitle.text = headerItem.name
            followingSubtitle.text = headerItem.subtitle
            
            if (!headerItem.coverUrl.isNullOrEmpty()) {
                Glide.with(view.context)
                    .load(headerItem.coverUrl)
                    .centerCrop()
                    .into(followingCover)
            } else {
                followingCover.setImageDrawable(null)
            }
            
            view.isFocusable = true
            view.isFocusableInTouchMode = false
            view.setOnClickListener {
                val intent = android.content.Intent(view.context, Class.forName("com.example.anird.tv.TvDetailsActivity")).apply {
                    putExtra("mal_id", headerItem.malId)
                }
                view.context.startActivity(intent)
            }
        } else if (headerItem is TvIconHeaderItem) {
            normalContainer.visibility = View.VISIBLE
            followingContainer.visibility = View.GONE
            
            if (headerItem.iconResId != 0) {
                iconView.setImageResource(headerItem.iconResId)
                iconView.visibility = View.VISIBLE
            } else {
                iconView.visibility = View.GONE
            }
            // Show chevron only for Categorías
            if (headerItem.name == "Categorías") {
                chevronView.visibility = View.VISIBLE
                val isExpanded = isExpandedProvider()
                chevronView.rotation = if (isExpanded) 180f else 0f
                view.isFocusable = true
                view.setOnClickListener {
                    onCategoriesClicked()
                }
            } else {
                chevronView.visibility = View.GONE
                view.setOnClickListener(null)
            }
            labelView.text = headerItem.name
        } else {
            // Default text-only header or SectionRow
            normalContainer.visibility = View.VISIBLE
            followingContainer.visibility = View.GONE
            iconView.visibility = View.GONE
            chevronView.visibility = View.GONE
            labelView.text = headerItem?.name
            
            // Si no tiene ícono pero no es TvFollowing, podría ser un SectionRow
            if (headerItem != null && headerItem.name == "SIGUIENDO") {
                labelView.textSize = 12f
                labelView.isAllCaps = true
                labelView.alpha = 0.5f
            } else {
                labelView.textSize = 16f
                labelView.isAllCaps = false
                labelView.alpha = 1.0f
            }
        }
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
        val textActiveColor = ContextCompat.getColor(view.context, R.color.tv_primary) // Red text like web
        
        val chevronView = view.findViewById<ImageView>(R.id.header_chevron)
        val followingTitle = view.findViewById<TextView>(R.id.following_title)
        
        // El selectLevel va de 0.0f (no seleccionado) a 1.0f (seleccionado)
        val isSelected = holder.selectLevel > 0.5f
        
        if (isSelected) {
            iconView.setColorFilter(activeColor)
            chevronView.setColorFilter(activeColor)
            labelView.setTextColor(textActiveColor)
            followingTitle.setTextColor(textActiveColor)
            view.alpha = 1.0f
            view.setBackgroundResource(R.drawable.tv_header_item_bg)
        } else {
            iconView.setColorFilter(inactiveColor)
            chevronView.setColorFilter(inactiveColor)
            labelView.setTextColor(inactiveColor)
            followingTitle.setTextColor(ContextCompat.getColor(view.context, android.R.color.white))
            
            // Cuando selectLevel es 0 (no seleccionado), alpha es ~0.5f, 
            // cuando es 1 (seleccionado), alpha es 1.0f.
            view.alpha = 0.5f + (holder.selectLevel * 0.5f)
            view.background = null
        }
    }
}
