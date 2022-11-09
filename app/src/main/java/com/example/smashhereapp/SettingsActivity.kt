package com.example.smashhereapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.appcompat.widget.Toolbar

class SettingsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)
        //        Déclarer la toolbar
        val toolbar: Toolbar =findViewById(R.id.SettingsScreen_Toolbar)
        setSupportActionBar(toolbar)

        //        Bouton de retour
//        Dans le Manifest il faut ajouter "parentActivityName" + l'activity concernée
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

    }
}