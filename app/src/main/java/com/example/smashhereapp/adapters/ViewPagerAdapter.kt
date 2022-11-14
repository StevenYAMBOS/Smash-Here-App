package com.example.smashhereapp.adapters

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.Lifecycle
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.example.smashhereapp.tabsFragments.FrameDataFragment
import com.example.smashhereapp.tabsFragments.RulesetFragment
import com.example.smashhereapp.tabsFragments.StagesFragment
import com.example.smashhereapp.tabsFragments.TipsFragment

class ViewPagerAdapter(fragmentManager: FragmentManager, lifecycle: Lifecycle): FragmentStateAdapter(fragmentManager, lifecycle) {
    override fun getItemCount(): Int {
        return 4
    }

    override fun createFragment(position: Int): Fragment {
        return   when(position){
            0->{
                TipsFragment()
            }
            1->{
                StagesFragment()
            }
            2->{
                RulesetFragment()
            }
            3->{
                FrameDataFragment()
            }
            else->{
                Fragment()
            }

        }
    }
}