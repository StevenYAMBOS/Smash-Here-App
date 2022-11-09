package com.example.smashhereapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.appcompat.widget.Toolbar

class AdvancedTechniquesActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_advanced_techniques)

        //        Déclarer la toolbar
        val toolbar: Toolbar =findViewById(R.id.AdvancedTechniquesScreen_Toolbar)
        setSupportActionBar(toolbar)

        //        Bouton de retour
//        Dans le Manifest il faut ajouter "parentActivityName" + l'activity concernée
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

    }
}