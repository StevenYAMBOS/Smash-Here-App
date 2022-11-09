package com.example.smashhereapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.widget.Toolbar
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
//        Déclarer la toolbar
        val toolbar: Toolbar =findViewById(R.id.HomeScreen_Toolbar)
        setSupportActionBar(toolbar)

    //        On appelle la Bottom Navigation
    val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

//        "setOnItemSelectedListener" -> nouvelle méthode qui gère la navigation
    bottomNavigationView.setOnItemSelectedListener {

        when (it.itemId) {
            R.id.fighters -> {
                val intent = Intent(this, FightersActivity::class.java)
                startActivity(intent)
                return@setOnItemSelectedListener true
            }
            R.id.ATs -> {
                val intent = Intent(this, AdvancedTechniquesActivity::class.java)
                startActivity(intent)
                return@setOnItemSelectedListener true
            }
            R.id.settings -> {
                val intent = Intent(this, SettingsActivity::class.java)
                startActivity(intent)
                return@setOnItemSelectedListener true
            }
            else -> {
            }
        }
        true
    }
}

//    Appeler le menu de la toolbar
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.custom_appbar_homescreen, menu)
        return true
    }

//    Icônes de la toolbar
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when(item.itemId){
            R.id.notifications_icon->{
                Toast.makeText(this, "Bien reçu", Toast.LENGTH_SHORT).show()
            }
        }
        return super.onOptionsItemSelected(item)
    }

}