package com.example.smashhereapp

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.*
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar

class FightersActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_fighters)

//        Toolbar
        val toolbar: Toolbar = findViewById(R.id.FightersScreen_Toolbar)
        setSupportActionBar(toolbar)
//        Bouton de retour
//        Dans le Manifest il faut ajouter "parentActivityName" + l'activity concernée
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)



//        var characters: ArrayList<ImageButton> =arrayListOf(
//            findViewById(R.id.Alph),
//            findViewById(R.id.Banjo),
//            findViewById(R.id.Bayonetta),
//            findViewById(R.id.Bowser),
//            findViewById(R.id.Bowser_Jr),
//            findViewById(R.id.Byleth),
//            findViewById(R.id.Captain_Falcon),
//            findViewById(R.id.Charizard),
//            findViewById(R.id.Chrom),
//            findViewById(R.id.Cloud),
//            findViewById(R.id.Corrin),
//            findViewById(R.id.Daisy),
//            findViewById(R.id.Dark_Pit),
//            findViewById(R.id.Dark_Samus),
//            findViewById(R.id.Diddy_Kong),
//            findViewById(R.id.Donkey_Kong),
//            findViewById(R.id.Dr_Mario),
//            findViewById(R.id.Falco),
//            findViewById(R.id.Fox),
//            findViewById(R.id.Ganondorf),
//            findViewById(R.id.mr_game_watch),
//            findViewById(R.id.Greninja),
//            findViewById(R.id.Hero),
//            findViewById(R.id.Ice_Climbers),
//            findViewById(R.id.Ike),
//            findViewById(R.id.Incineroar),
//            findViewById(R.id.Inkling),
//            findViewById(R.id.Isabelle),
//            findViewById(R.id.Ivysaur),
//            findViewById(R.id.Jigglypuff),
//            findViewById(R.id.Joker),
//            findViewById(R.id.Kazuya),
//            findViewById(R.id.Ken),
//            findViewById(R.id.King_Dedede),
//            findViewById(R.id.King_K_Rool),
//            findViewById(R.id.Kirby),
//            findViewById(R.id.Link),
//            findViewById(R.id.Little_Mac),
//            findViewById(R.id.Lucario),
//            findViewById(R.id.Lucas),
//            findViewById(R.id.Lucina),
//            findViewById(R.id.Luigi),
//            findViewById(R.id.Mario),
//            findViewById(R.id.Marth),
//            findViewById(R.id.Mega_Man),
//            findViewById(R.id.Meta_Knight),
//            findViewById(R.id.Mewtwo),
//            findViewById(R.id.Mii_Brawler),
//            findViewById(R.id.Mii_Gunner),
//            findViewById(R.id.Mii_Swordfighter),
//            findViewById(R.id.Min_Min),
//            findViewById(R.id.Mythra),
//            findViewById(R.id.Ness),
//            findViewById(R.id.Olimar),
//            findViewById(R.id.Pac_Man),
//            findViewById(R.id.Palutena),
//            findViewById(R.id.Peach),
//            findViewById(R.id.Pichu),
//            findViewById(R.id.Pikachu),
//            findViewById(R.id.Piranha_Plant),
//            findViewById(R.id.Pit),
//            findViewById(R.id.Pyra),
//            findViewById(R.id.Richter),
//            findViewById(R.id.Ridley),
//            findViewById(R.id.R_O_B),
//            findViewById(R.id.Robin),
//            findViewById(R.id.Rosalina),
//            findViewById(R.id.Roy),
//            findViewById(R.id.Ryu),
//            findViewById(R.id.Samus),
//            findViewById(R.id.Sephiroth),
//            findViewById(R.id.Sheik),
//            findViewById(R.id.Shulk),
//            findViewById(R.id.Simon),
//            findViewById(R.id.Snake),
//            findViewById(R.id.Sonic),
//            findViewById(R.id.Sora),
//            findViewById(R.id.Squirtle),
//            findViewById(R.id.Steve),
//            findViewById(R.id.Terry),
//            findViewById(R.id.Toon_Link),
//            findViewById(R.id.Villager),
//            findViewById(R.id.Wario),
//            findViewById(R.id.Wii_Fit_Trainer),
//            findViewById(R.id.Wolf),
//            findViewById(R.id.Yoshi),
//            findViewById(R.id.Young_Link),
//            findViewById(R.id.Zelda),
//            findViewById(R.id.Zero_Suit_Samus)
//        )
    }

    //    Appeler le menu de la toolbar
//    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
//        menuInflater.inflate(R.menu.custom_appbar_fighters, menu)
//        return super.onCreateOptionsMenu(menu)
//    }

//        Icônes de la toolbar
//    override fun onOptionsItemSelected(item: MenuItem): Boolean {
//        when (item.itemId) {
//            R.id.search_icon -> {
//                Toast.makeText(this, "Oui, bien reçu", Toast.LENGTH_SHORT).show()
//            }
//        }
//        return super.onOptionsItemSelected(item)
//    }
}