<!-- src/components/ui/FlowchartGraph.vue -->

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Step } from '@/types/collections'

// Définition de la prop reçue : un tableau d'étapes
const props = defineProps<{ steps: Step[] }>()

// Dimensions des cartes et espacement entre niveaux
const nodeWidth = 300 // largeur fixe du .node-card en px
const nodeHeight = 100 // hauteur fixe du .node-card en px
const spacingX = 250 // écart horizontal entre cartes sur le même niveau
const spacingY = 200 // écart vertical entre niveaux
// const branchY = spacingY / 2 // hauteur de la “branche” intermédiaire (depuis le bas du parent)

/**
 * positions : computed qui calcule pour chaque étape
 * un objet { x, y } en fonction de son "niveau" dans le graphe
 */
const positions = computed(() => {
  const pos: Record<string, { x: number; y: number }> = {}
  const levels: Record<number, string[]> = {}

  // 1) Calcule de levels comme avant
  const findLevel = (id: string, seen = new Set<string>()): number => {
    if (seen.has(id)) return 0
    seen.add(id)
    const s = props.steps.find((s) => s.id === id)
    if (!s || (s.PreviousSteps?.length ?? 0) === 0) return 0
    return 1 + Math.max(...s.PreviousSteps!.map((p) => findLevel(p, new Set(seen))))
  }
  props.steps.forEach((s) => {
    const lvl = findLevel(s.id)
    ;(levels[lvl] ??= []).push(s.id)
  })

  // 2) Place les racines (niveau 0) côte à côte
  const roots = levels[0] ?? []
  roots.forEach((id, i) => {
    pos[id] = { x: i * (nodeWidth + spacingX), y: 0 }
  })

  // 3) Pour chaque niveau supérieur, on centre chaque groupe d’enfants sous son parent
  const maxLevel = Math.max(...Object.keys(levels).map(Number))
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    const ids = levels[lvl] ?? []
    // regroupe par parent
    const groups: Record<string, string[]> = {}
    ids.forEach((id) => {
      const parent = props.steps.find((s) => s.id === id)?.PreviousSteps?.[0] ?? ''
      ;(groups[parent] ??= []).push(id)
    })

    // pour chaque parent, espace ses enfants
    Object.entries(groups).forEach(([parentId, children]) => {
      const px = pos[parentId].x // x du parent
      const totalW = children.length * nodeWidth + (children.length - 1) * spacingX
      // on centre le groupe sous le parent
      let startX = px + nodeWidth / 2 - totalW / 2

      children.forEach((childId) => {
        pos[childId] = {
          x: startX,
          y: lvl * spacingY,
        }
        startX += nodeWidth + spacingX
      })
    })
  }

  return pos
})

/**
 * edges : computed qui crée la liste des connexions à tracer
 * sous forme d'objets { from, to }, puis filtre celles invalides.
 */
const edges = computed(() => {
  return (
    props.steps
      .flatMap((step) => {
        // On traite PreviousSteps null ou undefined comme []
        const prevs = step.PreviousSteps ?? []
        // Pour chaque parent, on crée une arête parent → enfant
        return prevs.map((prevId) => ({ from: prevId, to: step.id }))
      })
      // On ne garde que si on a bien position[from] ET position[to]
      .filter((e) => positions.value[e.from] && positions.value[e.to])
  )
})

/**
 * Dimensions totales du graphe SVG :
 * on prend la plus grande coordonnée x ou y et on ajoute
 * la taille d'une node pour englober toutes les cartes.
 */
const graphWidth = computed(() => {
  const maxX = Math.max(...Object.values(positions.value).map((p) => p.x))
  return maxX + nodeWidth
})
const graphHeight = computed(() => {
  const maxY = Math.max(...Object.values(positions.value).map((p) => p.y))
  return maxY + nodeHeight
})
</script>

<template>
  <div class="graph-wrapper" :style="{ width: graphWidth + 'px', height: graphHeight + 'px' }">
    <!-- Couche SVG pour tracer les lignes -->
    <svg class="edges-layer" :width="graphWidth" :height="graphHeight">
      <!-- Pour chaque arête valide, on dessine un <line> -->
      <!-- `:x1="positions[edge.from].x + nodeWidth / 2"` : milieu bas du parent -->
      <!-- `:x2="positions[edge.to].x + nodeWidth / 2"` : milieu haut de l'enfant -->
      <path
        v-for="edge in edges"
        :key="edge.from + '->' + edge.to"
        :d="`
          M ${positions[edge.from].x + nodeWidth / 2} ${positions[edge.from].y + nodeHeight}
          V ${positions[edge.to].y + nodeHeight / 2}
          H ${positions[edge.to].x + nodeWidth / 2}
          V ${positions[edge.to].y}
        `"
        stroke="#666"
        fill="none"
        stroke-width="1"
      />
    </svg>

    <!-- Couche HTML pour afficher les cartes -->
    <div class="nodes-layer">
      <div
        v-for="step in steps"
        :key="step.id"
        class="node-card"
        :style="{
          left: positions[step.id].x + 'px',
          top: positions[step.id].y + 'px',
        }"
      >
        <!-- Titre et sous-titre de l'étape -->
        <h4>{{ step.title }}</h4>
        <p>{{ step.subTitle }}</p>

        <!-- Compteur de contenus, protégé contre un step.Contents null -->
        <span class="content-count">
          {{ (step.Contents ?? []).length }} contenu
          <span v-if="(step.Contents ?? []).length > 1">s</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Conteneur principal centré, dimensions dynamiques */
.graph-wrapper {
  position: relative;
  margin: var(--spacing-2xl) auto;
  background-color: var(--color-darker-charcoal);
  display: flex;
  justify-content: center;
}

/* SVG positionné absolu pour recouvrir tout le graphe */
.edges-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

/* Conteneur des cartes au-dessus du SVG */
.nodes-layer {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

/* Carte de chaque étape */
.node-card {
  position: absolute;
  width: 300px;
  height: 100px;
  background: #1f1f1f;
  color: white;
  padding: var(--spacing-md);
  border-radius: 8px;
  border: 1px solid #444;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-sm);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
  cursor: pointer;
}

.node-card h4 {
  color: var(--color-cream);
  font-weight: 600;
  font-size: var(--font-size-base);
  margin: 0;
}
.node-card p {
  color: var(--color-light-gray);
  margin: 0;
  font-size: var(--font-size-sm);
}
/* Nouveau style pour le compteur */
.content-count {
  color: var(--color-gold);
  font-size: var(--font-size-sm);
}
.node-card:hover {
  border-color: var(--color-cream);
  transform: scale(1.03);
  transition:
    transform 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
  box-shadow: 0 6px 12px rgba(255, 255, 255, 0.15);
}
</style>
