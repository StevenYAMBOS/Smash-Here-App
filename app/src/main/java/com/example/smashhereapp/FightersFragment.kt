package com.example.smashhereapp

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.OnBackPressedCallback
import androidx.activity.addCallback
import androidx.appcompat.widget.Toolbar
import com.example.smashhereapp.R
import com.google.android.material.bottomnavigation.BottomNavigationView


class FightersFragment : Fragment() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
    val view = inflater.inflate(R.layout.fragment_fighters, container, false)
    val toolbar: Toolbar = view.findViewById<Toolbar>(R.id.FightersScreen_Toolbar)
//    Cacher la barre de navigation
    val bottomNavigationView = requireActivity().findViewById<BottomNavigationView>(R.id.bottom_navigation)
    bottomNavigationView.visibility = View.GONE
    return view




}
}