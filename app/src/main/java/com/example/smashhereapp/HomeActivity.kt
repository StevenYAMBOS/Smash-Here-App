package com.example.smashhereapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.Toolbar
import androidx.viewpager2.widget.ViewPager2
import com.example.smashhereapp.adapters.ViewPagerAdapter
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator

class HomeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
//        Déclarer la toolbar
        val toolbar: Toolbar =findViewById(R.id.HomeScreen_Toolbar)
        setSupportActionBar(toolbar)


//        TabLayout & ViewPager
        val tabLayout = findViewById<TabLayout>(R.id.tabLayout)
        val viewPager2 = findViewById<ViewPager2>(R.id.viewPager2)

        val adapter = ViewPagerAdapter(supportFragmentManager,lifecycle)
        viewPager2.adapter = adapter

        TabLayoutMediator(tabLayout,viewPager2){tab,position->
            when(position){
                0->{
                    tab.text="Tips"
                }
                1->{
                    tab.text="Stages"
                }
                2->{
                    tab.text="Ruleset"
                }
                3->{
                    tab.text="Frame Data"
                }
            }
        }.attach()

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