package com.example.anird.tv

import android.content.Intent
import android.os.Bundle
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.leanback.app.VerticalGridSupportFragment
import androidx.leanback.widget.*
import com.example.anird.R

class TvCategoriesGridFragment : VerticalGridSupportFragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setupGrid()
        setupAdapter()
        setupListeners()
    }

    private fun setupGrid() {
        val customGridPresenter = VerticalGridPresenter(FocusHighlight.ZOOM_FACTOR_MEDIUM)
        customGridPresenter.numberOfColumns = 4
        setGridPresenter(customGridPresenter)
    }

    private fun setupAdapter() {
        // Usamos un presenter parecido al de Settings para mostrar el nombre del género en una tarjeta
        val categoryPresenter = object : Presenter() {
            override fun onCreateViewHolder(parent: ViewGroup): Presenter.ViewHolder {
                val cardView = object : ImageCardView(parent.context) {
                    override fun setSelected(selected: Boolean) {
                        super.setSelected(selected)
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
                val height = width / 2
                cardView.setMainImageDimensions(width, height)
                cardView.cardType = BaseCardView.CARD_TYPE_INFO_UNDER
                cardView.infoAreaBackground = ContextCompat.getDrawable(parent.context, R.color.tv_surface_card)
                
                return Presenter.ViewHolder(cardView)
            }

            override fun onBindViewHolder(viewHolder: Presenter.ViewHolder, item: Any?) {
                val catItem = item as? CategoryItem ?: return
                val cardView = viewHolder.view as ImageCardView
                cardView.titleText = catItem.name
                cardView.mainImageView?.setImageResource(R.drawable.ic_sidebar_categories)
                cardView.mainImageView?.setPadding(32, 32, 32, 32)
            }

            override fun onUnbindViewHolder(viewHolder: Presenter.ViewHolder) {
                val cardView = viewHolder.view as ImageCardView
                cardView.mainImageView?.setImageDrawable(null)
            }
        }

        val adapter = ArrayObjectAdapter(categoryPresenter)
        
        val categories = listOf(
            CategoryItem("1", "Acción"),
            CategoryItem("2", "Aventura"),
            CategoryItem("4", "Comedia"),
            CategoryItem("8", "Drama"),
            CategoryItem("10", "Fantasía"),
            CategoryItem("19", "Musical"),
            CategoryItem("22", "Romance"),
            CategoryItem("24", "Ciencia Ficción"),
            CategoryItem("42", "Seinen"),
            CategoryItem("25", "Shoujo"),
            CategoryItem("27", "Shounen"),
            CategoryItem("36", "Recuentos de la Vida"),
            CategoryItem("30", "Deportes"),
            CategoryItem("37", "Sobrenatural"),
            CategoryItem("41", "Thriller")
        )
        
        adapter.addAll(0, categories)
        this.adapter = adapter
    }

    private fun setupListeners() {
        setOnItemViewClickedListener { _, item, _, _ ->
            if (item is CategoryItem) {
                // TODO: Lanzar nueva activity o fragment para listar animes de esta categoria
                // Por ahora lanzamos TvSearchActivity y pre-filtramos si quisieramos, o creamos TvGenreActivity
                // Crearemos un TvGenreActivity que liste animes
            }
        }
    }
}

data class CategoryItem(val id: String, val name: String)
