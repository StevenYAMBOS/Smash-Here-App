<!-- src/components/ui/CreateGuideForm.vue -->

<template>
  <form @submit.prevent="submit" class="create-guide-form">
    <h2>Create a new Guide</h2>

    <!-- Champ Titre -->
    <div class="field">
      <label for="title">Title*</label>
      <input id="title" v-model="title" type="text" placeholder="New title" required />
    </div>

    <!-- Champ Sous-titre -->
    <div class="field">
      <label for="subTitle">Subtitle*</label>
      <input id="subTitle" v-model="subTitle" type="text" placeholder="New subtitle" />
    </div>

    <!-- Champ Description -->
    <div class="field">
      <label for="description">Description*</label>
      <textarea
        id="description"
        v-model="description"
        rows="4"
        placeholder="New description"
        required
      ></textarea>
    </div>

    <!-- Champ Difficulté -->
    <div class="field">
      <label for="difficulty">Difficulty</label>
      <select id="difficulty" v-model="difficulty" required>
        <option value="" disabled>Select a difficulty</option>
        <option value="video">beginner</option>
        <option value="article">mid-level</option>
        <option value="page">high-level</option>
        <option value="roadmap">top-level</option>
      </select>
    </div>

    <!-- Champ Langage -->
    <div class="field">
      <label for="language">Language</label>
      <select id="language" v-model="language" required>
        <option value="" disabled>Select a language</option>
        <option value="af">Afrikaans</option>
        <option value="sq">Albanian - (Shqip)</option>
        <option value="am">Amharic - (አማርኛ)</option>
        <option value="ar">Arabic - (العربية)</option>
        <option value="an">Aragonese - (Aragonés)</option>
        <option value="hy">Armenian - (Հայերեն)</option>
        <option value="ast">Asturian - (Asturianu)</option>
        <option value="ay">Aymara - (Aymar aru)</option>
        <option value="az">Azerbaijani - (Azərbaycan dili)</option>
        <option value="eu">Basque - (Euskara)</option>
        <option value="be">Belarusian - (Беларуская)</option>
        <option value="bn">Bengali - (বাংলা)</option>
        <option value="brx">Bodo - (बर')</option>
        <option value="bs">Bosnian - (Bosanski)</option>
        <option value="br">Breton - (Brezhoneg)</option>
        <option value="bg">Bulgarian - (Български)</option>
        <option value="ca">Catalan - (Català)</option>
        <option value="ckb">Central - Kurdish (کوردی)</option>
        <option value="ce">Chechen (Нохчийн мотт)</option>
        <option value="zh">Chinese (中文)</option>
        <option value="zh-HK">Chinese Hong Kong - (中文 - 香港)</option>
        <option value="zh-CN">Chinese Simplified - (中文简体)</option>
        <option value="zh-TW">Chinese Traditional - (中文繁體)</option>
        <option value="co">Corsican - (Corsu)</option>
        <option value="hr">Croatian - (Hrvatski)</option>
        <option value="cs">Czech - (Čeština)</option>
        <option value="da">Danish - (Dansk)</option>
        <option value="dv">Dhivehi - (ދިވެހި)</option>
        <option value="nl">Dutch (Nederlands)</option>
        <option value="dz">Dzongkha (རྫོང་ཁ)</option>
        <option value="en">English</option>
        <option value="en-AU">English (Australia)</option>
        <option value="en-CA">English (Canada)</option>
        <option value="en-IN">English (India)</option>
        <option value="en-NZ">English (New Zealand)</option>
        <option value="en-ZA">English (South Africa)</option>
        <option value="en-GB">English (United Kingdom)</option>
        <option value="en-US">English (United States)</option>
        <option value="eo">Esperanto</option>
        <option value="et">Estonian (Eesti)</option>
        <option value="ee">Ewe (Eʋegbe)</option>
        <option value="fo">Faroese - (Føroyskt)</option>
        <option value="fil">Filipino (Wikang Filipino)</option>
        <option value="fi">Finnish (Suomi)</option>
        <option value="fr">French (Français)</option>
        <option value="fr-CA">French Canada - (Français Canada)</option>
        <option value="fr-FR">French France - (Français France)</option>
        <option value="fr-CH">French Switzerland - (Français Suisse)</option>
        <option value="gl">Galician - (Galego)</option>
        <option value="ka">Georgian - (ქართული)</option>
        <option value="de">German - (Deutsch)</option>
        <option value="de-AT">German Austria - (Deutsch Österreich)</option>
        <option value="de-DE">German Germany - (Deutsch Deutschland)</option>
        <option value="de-LI">German Liechtenstein - (Deutsch Liechtenstein)</option>
        <option value="de-CH">German Switzerland - (Deutsch Schweiz)</option>
        <option value="el">Greek - (Ελληνικά)</option>
        <option value="gn">Guarani - (Avañe'ẽ)</option>
        <option value="gu">Gujarati - (ગુજરાતી)</option>
        <option value="ha">Hausa - (هَوُسَ)</option>
        <option value="haw">Hawaiian - (ʻŌlelo Hawaiʻi)</option>
        <option value="he">Hebrew - (עברית)</option>
        <option value="hi">Hindi - (हिन्दी)</option>
        <option value="hu">Hungarian - (Magyar)</option>
        <option value="is">Icelandic - (Íslenska)</option>
        <option value="id">Indonesian - (Bahasa Indonesia)</option>
        <option value="ia">Interlingua</option>
        <option value="iu">Inuktitut - (ᐃᓄᒃᑎᑐᑦ)</option>
        <option value="ga">Irish - (Gaeilge)</option>
        <option value="it">Italian - (Italiano)</option>
        <option value="it-IT">Italian Italy - (Italiano Italia)</option>
        <option value="it-CH">Italian Switzerland - (Italiano - Svizzera)</option>
        <option value="ja">Japanese - (日本語)</option>
        <option value="kl">Kalaallisut - (Kalaallisut)</option>
        <option value="kn">Kannada - (ಕನ್ನಡ)</option>
        <option value="ks">Kashmiri - (कॉशुर / كٲشُر)</option>
        <option value="kk">Kazakh - (Қазақ тілі)</option>
        <option value="km">Khmer - (ខ្មែរ)</option>
        <option value="rw">Kinyarwanda - (Ikinyarwanda)</option>
        <option value="ko">Korean - (한국어)</option>
        <option value="ku">Kurdish - (Kurdî)</option>
        <option value="ky">Kyrgyz - (Кыргызча)</option>
        <option value="lo">Lao - (ລາວ)</option>
        <option value="la">Latin - (Latina)</option>
        <option value="lv">Latvian - (Latviešu)</option>
        <option value="ln">Lingala - (Lingála)</option>
        <option value="lt">Lithuanian - (Lietuvių)</option>
        <option value="lg">Luganda - (Luganda)</option>
        <option value="lb">Luxembourgish - (Lëtzebuergesch)</option>
        <option value="mk">Macedonian - (Македонски)</option>
        <option value="mai">Maithili - (मैथिली)</option>
        <option value="ms">Malay - (Bahasa Melayu)</option>
        <option value="ml">Malayalam - (മലയാളം)</option>
        <option value="mt">Maltese - (Malti)</option>
        <option value="mni">Manipuri - (ꯃꯅꯤꯄꯨꯔꯤ)</option>
        <option value="mr">Marathi - (मराठी)</option>
        <option value="mn">Mongolian - (Монгол)</option>
        <option value="ne">Nepali - (नेपाली)</option>
        <option value="nso">Northern Sotho - (Sesotho sa Leboa)</option>
        <option value="no">Norwegian (Norsk)</option>
        <option value="nb">Norwegian Bokmål - (Norsk bokmål)</option>
        <option value="nn">Norwegian Nynorsk - (Nynorsk)</option>
        <option value="oc">Occitan</option>
        <option value="or">Oriya - (ଓଡ଼ିଆ)</option>
        <option value="om">Oromo - (Afaan Oromoo)</option>
        <option value="os">Ossetian - (Ирон æвзаг)</option>
        <option value="ps">Pashto - (پښتو)</option>
        <option value="fa">Persian - (فارسی)</option>
        <option value="pl">Polish - (Polski)</option>
        <option value="pt">Portuguese - (Português)</option>
        <option value="pt-BR">Portuguese Brazil - (Português Brasil)</option>
        <option value="pt-PT">Portuguese Portugal - (Português Portugal)</option>
        <option value="pa">Punjabi - (ਪੰਜਾਬੀ)</option>
        <option value="qu">Quechua - (Runa Simi)</option>
        <option value="ro">Romanian - (Română)</option>
        <option value="mo">Romanian Moldova - (Română Moldova)</option>
        <option value="rm">Romansh - (Rumantsch)</option>
        <option value="ru">Russian - (Русский)</option>
        <option value="sm">Samoan - (Gagana Samoa)</option>
        <option value="sat">Santali - (ᱥᱟᱱᱛᱟᱲᱤ)</option>
        <option value="sc">Sardinian - (Sardu)</option>
        <option value="gd">Scottish Gaelic - (Gàidhlig)</option>
        <option value="sr">Serbian - (Српски)</option>
        <option value="sh">Serbo_Croatian - (Srpskohrvatski)</option>
        <option value="sn">Shona - (ChiShona)</option>
        <option value="sd">Sindhi - (سنڌي)</option>
        <option value="si">Sinhala - (සිංහල)</option>
        <option value="sk">Slovak - (Slovenčina)</option>
        <option value="sl">Slovenian - (Slovenščina)</option>
        <option value="so">Somali - (Soomaali)</option>
        <option value="st">Southern - Sotho (Sesotho)</option>
        <option value="es">Spanish - (Español)</option>
        <option value="es-AR">Spanish Argentina - (Español Argentina)</option>
        <option value="es-419">Spanish Latin America - (Español Latinoamérica)</option>
        <option value="es-MX">Spanish Mexico - (Español México)</option>
        <option value="es-ES">Spanish Spain - (Español España)</option>
        <option value="es-US">Spanish United States - (Español Estados Unidos)</option>
        <option value="su">Sundanese - (Basa Sunda)</option>
        <option value="sw">Swahili - (Kiswahili)</option>
        <option value="sv">Swedish - (Svenska)</option>
        <option value="tg">Tajik - (Тоҷикӣ)</option>
        <option value="ta">Tamil - (தமிழ்)</option>
        <option value="tt">Tatar - (Татар)</option>
        <option value="te">Telugu - (తెలుగు)</option>
        <option value="th">Thai - (ไทย)</option>
        <option value="ti">Tigrinya - (ትግርኛ)</option>
        <option value="to">Tongan - (Lea fakatonga)</option>
        <option value="tn">Tswana - (Setswana)</option>
        <option value="tr">Turkish - (Türkçe)</option>
        <option value="tk">Turkmen - (Türkmençe)</option>
        <option value="tw">Twi - (Twi)</option>
        <option value="udm">Udmurt - (Удмурт кыл)</option>
        <option value="uk">Ukrainian - (Українська)</option>
        <option value="ur">Urdu - (اردو)</option>
        <option value="ug">Uyghur - (ئۇيغۇرچە)</option>
        <option value="uz">Uzbek - (O'zbek)</option>
        <option value="ve">Venda - (Tshivenḓa)</option>
        <option value="vi">Vietnamese - (Tiếng Việt)</option>
        <option value="wa">Walloon - (Walon)</option>
        <option value="cy">Welsh - (Cymraeg)</option>
        <option value="fy">Western Frisian - (Frysk)</option>
        <option value="wo">Wolof - (Wollof)</option>
        <option value="xh">Xhosa - (isiXhosa)</option>
        <option value="yi">Yiddish - (ייִדיש)</option>
        <option value="yo">Yoruba - (Èdè Yorùbá)</option>
        <option value="za">Zhuang - (Saɯ cueŋƅ)</option>
        <option value="zu">Zulu - (isiZulu)</option>
      </select>
    </div>

    <!-- Champ version -->
    <div class="field">
      <label for="version">Version</label>
      <select id="version" v-model="version" required>
        <option value="" disabled>Select a version</option>
        <option value="0.0">0.0</option>
        <option value="1.0">1.0</option>
        <option value="1.1">1.1</option>
        <option value="1.2">1.2</option>
        <option value="1.3">1.3</option>
        <option value="1.4">1.4</option>
        <option value="1.5">1.5</option>
        <option value="1.6">1.6</option>
        <option value="1.7">1.7</option>
        <option value="1.8">1.8</option>
        <option value="1.9">1.9</option>
        <option value="2.0">2.0</option>
        <option value="2.1">2.1</option>
        <option value="2.2">2.2</option>
        <option value="2.3">2.3</option>
        <option value="2.4">2.4</option>
        <option value="2.5">2.5</option>
        <option value="2.6">2.6</option>
        <option value="2.7">2.7</option>
        <option value="2.8">2.8</option>
        <option value="2.9">2.9</option>
        <option value="3.0">3.0</option>
        <option value="3.1">3.1</option>
        <option value="3.2">3.2</option>
        <option value="3.3">3.3</option>
        <option value="3.4">3.4</option>
        <option value="3.5">3.5</option>
        <option value="3.6">3.6</option>
        <option value="3.7">3.7</option>
        <option value="3.8">3.8</option>
        <option value="3.9">3.9</option>
        <option value="4.0">4.0</option>
        <option value="4.1">4.1</option>
        <option value="4.2">4.2</option>
        <option value="4.3">4.3</option>
        <option value="4.4">4.4</option>
        <option value="4.5">4.5</option>
        <option value="4.6">4.6</option>
        <option value="4.7">4.7</option>
        <option value="4.8">4.8</option>
        <option value="4.9">4.9</option>
        <option value="5.0">5.0</option>
      </select>
    </div>

    <div class="field">
      <!-- Champ Image de couverture -->
      <label for="cover">Cover Image</label>
      <div class="file-input-wrapper">
        <input
          id="cover"
          type="file"
          accept="image/webp,image/png,image/jpeg/pdf"
          @change="handleFileChange"
          class="file-input"
        />
        <button type="button" class="file-input-button" @click="triggerFileInput">
          <i class="pi pi-upload"></i>
          {{ coverFile ? coverFile.name : 'Choose an image' }}
        </button>
      </div>
      <p class="file-hint">Accepted formats: WEBP, PNG, JPEG, PDF (max 10MB)</p>
    </div>

    <!-- Champ Published (checkbox) -->
    <div class="field-row">
      <div class="switch-field">
        <label for="published-switch">Published</label>
        <button
          id="published-switch"
          type="button"
          class="switch-button"
          :class="{ active: published }"
          @click="published = !published"
          role="switch"
          :aria-checked="published"
        >
          <span class="switch-handle"></span>
        </button>
      </div>
      <!-- Champ Premium (checkbox) -->
      <!-- <div class="switch-field">
        <label for="premium-switch">Premium</label>
        <button
          id="premium-switch"
          type="button"
          class="switch-button"
          :class="{ active: premium }"
          @click="premium = !premium"
          role="switch"
          :aria-checked="premium"
        >
          <span class="switch-handle"></span>
        </button>
      </div> -->
    </div>

    <!-- Bouton de soumission -->
    <SubmitButton
      :label="loading ? 'Saving…' : 'Create guide'"
      :disabled="loading"
      icon="pi pi-save"
      iconPosition="left"
      variant="primary"
      type="submit"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import SubmitButton from './SubmitButton.vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const userStore = useUserStore()
const title = ref('')
const subTitle = ref('')
const coverFile = ref<File | null>(null)
const description = ref('')
const difficulty = ref('')
const language = ref('')
const version = ref('')
const published = ref(false)
// const premium = ref(false)
const loading = ref(false)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (WEBP, PNG, or JPEG)')
      return
    }

    coverFile.value = file
  }
}

function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

onMounted(async () => {
  await userStore.fetchAllGames()
})

async function submit() {
  if (loading.value) return

  // Validation
  if (!title.value || !subTitle.value || !description.value) {
    toast.error('Title, subtitle and description are required')
    return
  }

  // if (!coverFile.value) {
  //   toast.error('Cover image is required')
  //   return
  // }

  loading.value = true

  // Créer FormData pour multipart
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('subTitle', subTitle.value)
  formData.append('description', description.value)

  // Ajouter les champs optionnels seulement s'ils ont une valeur
  if (difficulty.value) {
    formData.append('difficulty', difficulty.value)
  }
  if (language.value) {
    formData.append('language', language.value)
  }
  if (version.value) {
    formData.append('version', version.value)
  }

  // Vérifier que le fichier existe avant de l'ajouter
  if (coverFile.value) {
    formData.append('cover', coverFile.value)
  }

  formData.append('published', published.value.toString())
  // formData.append('premium', premium.value.toString())

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token || localStorage.getItem('token')}`,
          // NE PAS définir Content-Type, le navigateur le fait automatiquement
        },
        body: formData,
      },
    )

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || `HTTP ${res.status}`)
    }

    toast.success('Guide created successfully!')

    // Réinitialiser le formulaire
    title.value = ''
    subTitle.value = ''
    description.value = ''
    coverFile.value = null
    published.value = false
    // premium.value = false

    // Réinitialiser l'input file
    const fileInput = document.getElementById('cover') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    // Rafraîchir la liste des guides
    await userStore.fetchProfile()
    emit('navigate', 'list-guides')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Failed to create guide')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()
</script>

<style scoped>
.create-guide-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.create-guide-form h2 {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  font-weight: bold;
}
.field {
  margin-bottom: var(--spacing-lg);
}
.field input,
.field textarea {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  background: var(--color-dark-gray);
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  color: var(--color-cream);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
}
.field label {
  display: block;
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}
.field input[type='text'],
.field input[type='url'],
.field textarea,
.field select,
.field .multiselect-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}
.field input[type='text']:focus,
.field input[type='url']:focus,
.field textarea:focus,
.field select:focus,
.field .multiselect-field:focus-within {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

/* Checkbox personnalisé (Publié / Premium) */
.field input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  margin-right: var(--spacing-sm);
  accent-color: var(--color-gold);
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.file-input-button:hover {
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

.file-input-button i {
  color: var(--color-gold);
}

.file-hint {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
}

/* Checkbox row */
.field-row {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: var(--color-cream);
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: var(--spacing-sm);
  accent-color: var(--color-gold);
}

/* Switch button styles */
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.switch-field label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin: 0;
}

.switch-button {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
}

.switch-button:hover {
  background: var(--color-light-gray);
}

.switch-button.active {
  background: var(--color-gold);
}

.switch-button.active:hover {
  background: var(--color-light-yellow);
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-cream);
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-button.active .switch-handle {
  transform: translateX(24px);
}

/* =============================
   vue-multiselect Styling
   ============================= */
.multiselect-field {
  width: 100%;
}
.multiselect-field .multiselect__tags {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-charcoal) !important;
  border-radius: var(--radius-sm) !important;
}
.multiselect-field .multiselect__tags input {
  background: transparent !important;
  color: var(--color-cream) !important;
}
.multiselect-field .multiselect__content {
  background: var(--color-charcoal) !important;
  border: 1px solid var(--color-medium-gray) !important;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
}
.multiselect-field .multiselect__element {
  background: var(--color-darker-charcoal) !important;
  color: var(--color-cream) !important;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-xs) 0 !important;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
}
.multiselect-field .multiselect__element:hover {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
}
.multiselect-field .multiselect__tag {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-xs);
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
}
.multiselect-field .multiselect__tag-icon {
  margin-left: var(--spacing-xs);
  color: var(--color-charcoal);
  cursor: pointer;
}
.multiselect-field .multiselect__tag-close {
  color: var(--color-charcoal);
}
.multiselect-field .multiselect__spinner,
.multiselect-field .multiselect__loading {
  color: var(--color-gold);
}

/* Bouton de soumission */
.submit-btn {
  width: 100%;
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    opacity 0.3s ease,
    background-color 0.3s ease;
}
.submit-btn:hover {
  opacity: 0.8;
  background: var(--color-light-yellow);
}
</style>
