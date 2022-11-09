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

//        Toolbar principale
//        Pour le moment je crée une toolbar principale que je vais réutiliser
//        dans mes fragments. Chaque toolbar dans les fragments aura
//        son propre menu.
        setSupportActionBar(findViewById(R.id.Toolbar))

//        Fragments de la bottom navigation
//        val homeFragment = HomeFragment()
//        val fightersFragment = FightersFragment()
//        val atsFragment = ATsFragment()
//        val settingsFragment = SettingsFragment()

//        Fragment principal
//        currentFragment(HomeFragment())

//        val navHostFragment = supportFragmentManager
//            .findFragmentById(R.id.navHostFragment) as NavHostFragment
//        navController = navHostFragment.navController

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

//    Va gérer les changements de fragments de la  bottom navigation
//    On met la fonction en privée mais je sais plus pourquoi
//        private fun currentFragment(fragment : Fragment){
//            supportFragmentManager.beginTransaction().apply {
//                replace(R.id.framelayout_bottomNav, fragment)
//  "addToBackStock(null)" permet le retour en arrière grâce au bouton Android
//                    .addToBackStack(null)
//                commit()
//            }
//        }
    }

