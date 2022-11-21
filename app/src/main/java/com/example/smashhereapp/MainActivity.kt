package com.example.smashhereapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import com.example.smashhereapp.databinding.ActivityMainBinding
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView

class MainActivity : AppCompatActivity() {

//    Initialisation de la fonction qui va gérer les changements de fragments de la bottom navigation
    private lateinit var currentFragment : Fragment

    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)



//        On appelle la Bottom Navigation
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

//        "setOnItemSelectedListener" -> nouvelle méthode qui gère la navigation
        bottomNavigationView.setOnItemSelectedListener {

            when (it.itemId) {
                R.id.home -> {
                    val intent = Intent(this@MainActivity, HomeActivity::class.java)
                    startActivity(intent)
                    return@setOnItemSelectedListener true
                }
                R.id.fighters -> {
                    val intent = Intent(this@MainActivity, FightersActivity::class.java)
                    startActivity(intent)
                    return@setOnItemSelectedListener true
                }
                R.id.ATs -> {
                    val intent = Intent(this@MainActivity, AdvancedTechniquesActivity::class.java)
                    startActivity(intent)
                    return@setOnItemSelectedListener true
                }
                R.id.settings -> {
                    val intent = Intent(this@MainActivity, SettingsActivity::class.java)
                    startActivity(intent)
                    return@setOnItemSelectedListener true
                }
                else -> {
                }
            }
            true
        }
    }
    }

