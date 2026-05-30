package com.example.anird.tv.presenter

import androidx.leanback.widget.HeaderItem

class TvFollowingHeaderItem(
    id: Long,
    name: String,
    val malId: Int,
    val coverUrl: String?,
    val subtitle: String = "Ver ahora"
) : HeaderItem(id, name)
