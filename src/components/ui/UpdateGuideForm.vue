<!-- src/components/ui/UpdateGuideForm.vue -->
<template>
  <div class="update-guide-container">
    <!-- Onglets -->
    <div class="tabs">
      <button
        :class="{ active: currentTab === 'info' }"
        @click="currentTab = 'info'"
        class="tab-button"
      >
        Informations
      </button>
      <button
        :class="{ active: currentTab === 'contentOfGuide' }"
        @click="currentTab = 'contentOfGuide'"
        class="tab-button"
      >
        Guide content
      </button>
    </div>

    <!-- **************** Onglet “Informations de base” **************** -->
    <div v-if="currentTab === 'info'" class="tab-content">
      <form @submit.prevent="submitInfo" class="update-guide-form">
        <h2>Informations</h2>

        <div class="form-section">
          <div class="field">
            <label for="title">Title</label>
            <input id="title" v-model="title" type="text" />
          </div>

          <div class="field">
            <label for="subTitle">Subtitle</label>
            <input id="subTitle" v-model="subTitle" type="text" />
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea id="description" v-model="description" rows="3"></textarea>
          </div>

          <!-- Champ Difficulté -->
          <div class="field">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" v-model="difficulty">
              <option value="" disabled>Select a difficulty</option>
              <option value="beginner">beginner</option>
              <option value="mid-level">mid-level</option>
              <option value="high-level">high-level</option>
              <option value="top-level">top-level</option>
            </select>
          </div>

          <!-- Champ Langage -->
          <div class="field">
            <label for="language">Language</label>
            <select id="language" v-model="language">
              <option value="" disabled>Select a language</option>
              <option value="AF">Afrikaans</option>
              <option value="SQ">Albanian - (Shqip)</option>
              <option value="AM">Amharic - (አማርኛ)</option>
              <option value="AR">Arabic - (العربية)</option>
              <option value="AN">Aragonese - (Aragonés)</option>
              <option value="HY">Armenian - (Հայերեն)</option>
              <option value="AST">Asturian - (Asturianu)</option>
              <option value="AY">Aymara - (Aymar aru)</option>
              <option value="AZ">Azerbaijani - (Azərbaycan dili)</option>
              <option value="EU">Basque - (Euskara)</option>
              <option value="BE">Belarusian - (Беларуская)</option>
              <option value="BN">Bengali - (বাংলা)</option>
              <option value="BRX">Bodo - (बर')</option>
              <option value="BS">Bosnian - (Bosanski)</option>
              <option value="BR">Breton - (Brezhoneg)</option>
              <option value="BG">Bulgarian - (Български)</option>
              <option value="CA">Catalan - (Català)</option>
              <option value="CKB">Central - Kurdish (کوردی)</option>
              <option value="CE">Chechen (Нохчийн мотт)</option>
              <option value="ZH">Chinese (中文)</option>
              <option value="ZH-HK">Chinese Hong Kong - (中文 - 香港)</option>
              <option value="ZH-CN">Chinese Simplified - (中文简体)</option>
              <option value="ZH-TW">Chinese Traditional - (中文繁體)</option>
              <option value="CO">Corsican - (Corsu)</option>
              <option value="HR">Croatian - (Hrvatski)</option>
              <option value="CS">Czech - (Čeština)</option>
              <option value="DA">Danish - (Dansk)</option>
              <option value="DV">Dhivehi - (ދިވެހި)</option>
              <option value="NL">Dutch (Nederlands)</option>
              <option value="DZ">Dzongkha (རྫོང་ཁ)</option>
              <option value="EN">English</option>
              <option value="EN-AU">English (Australia)</option>
              <option value="EN-CA">English (Canada)</option>
              <option value="EN-IN">English (India)</option>
              <option value="EN-NZ">English (New Zealand)</option>
              <option value="EN-ZA">English (South Africa)</option>
              <option value="EN-GB">English (United Kingdom)</option>
              <option value="EN-US">English (United States)</option>
              <option value="EO">Esperanto</option>
              <option value="ET">Estonian (Eesti)</option>
              <option value="EE">Ewe (Eʋegbe)</option>
              <option value="FO">Faroese - (Føroyskt)</option>
              <option value="FIL">Filipino (Wikang Filipino)</option>
              <option value="FI">Finnish (Suomi)</option>
              <option value="FR">French (Français)</option>
              <option value="FR-CA">French Canada - (Français Canada)</option>
              <option value="FR-FR">French France - (Français France)</option>
              <option value="FR-CH">French Switzerland - (Français Suisse)</option>
              <option value="GL">Galician - (Galego)</option>
              <option value="KA">Georgian - (ქართული)</option>
              <option value="DE">German - (Deutsch)</option>
              <option value="DE-AT">German Austria - (Deutsch Österreich)</option>
              <option value="DE-DE">German Germany - (Deutsch Deutschland)</option>
              <option value="DE-LI">German Liechtenstein - (Deutsch Liechtenstein)</option>
              <option value="DE-CH">German Switzerland - (Deutsch Schweiz)</option>
              <option value="EL">Greek - (Ελληνικά)</option>
              <option value="GN">Guarani - (Avañe'ẽ)</option>
              <option value="GU">Gujarati - (ગુજરાતી)</option>
              <option value="HA">Hausa - (هَوُسَ)</option>
              <option value="HAW">Hawaiian - (ʻŌlelo Hawaiʻi)</option>
              <option value="HE">Hebrew - (עברית)</option>
              <option value="HI">Hindi - (हिन्दी)</option>
              <option value="HU">Hungarian - (Magyar)</option>
              <option value="IS">Icelandic - (Íslenska)</option>
              <option value="ID">Indonesian - (Bahasa Indonesia)</option>
              <option value="IA">Interlingua</option>
              <option value="IU">Inuktitut - (ᐃᓄᒃᑎᑐᑦ)</option>
              <option value="GA">Irish - (Gaeilge)</option>
              <option value="IT">Italian - (Italiano)</option>
              <option value="IT-IT">Italian Italy - (Italiano Italia)</option>
              <option value="IT-CH">Italian Switzerland - (Italiano - Svizzera)</option>
              <option value="JA">Japanese - (日本語)</option>
              <option value="KL">Kalaallisut - (Kalaallisut)</option>
              <option value="KN">Kannada - (ಕನ್ನಡ)</option>
              <option value="KS">Kashmiri - (कॉशुर / كٲشُر)</option>
              <option value="KK">Kazakh - (Қазақ тілі)</option>
              <option value="KM">Khmer - (ខ្មែរ)</option>
              <option value="RW">Kinyarwanda - (Ikinyarwanda)</option>
              <option value="KO">Korean - (한국어)</option>
              <option value="KU">Kurdish - (Kurdî)</option>
              <option value="KY">Kyrgyz - (Кыргызча)</option>
              <option value="LO">Lao - (ລາວ)</option>
              <option value="LA">Latin - (Latina)</option>
              <option value="LV">Latvian - (Latviešu)</option>
              <option value="LN">Lingala - (Lingála)</option>
              <option value="LT">Lithuanian - (Lietuvių)</option>
              <option value="LG">Luganda - (Luganda)</option>
              <option value="LB">Luxembourgish - (Lëtzebuergesch)</option>
              <option value="MK">Macedonian - (Македонски)</option>
              <option value="MAI">Maithili - (मैथिली)</option>
              <option value="MS">Malay - (Bahasa Melayu)</option>
              <option value="ML">Malayalam - (മലയാളം)</option>
              <option value="MT">Maltese - (Malti)</option>
              <option value="MNI">Manipuri - (ꯃꯅꯤꯄꯨꯔꯤ)</option>
              <option value="MR">Marathi - (मराठी)</option>
              <option value="MN">Mongolian - (Монгол)</option>
              <option value="NE">Nepali - (नेपाली)</option>
              <option value="NSO">Northern Sotho - (Sesotho sa Leboa)</option>
              <option value="NO">Norwegian (Norsk)</option>
              <option value="NB">Norwegian Bokmål - (Norsk bokmål)</option>
              <option value="NN">Norwegian Nynorsk - (Nynorsk)</option>
              <option value="OC">Occitan</option>
              <option value="OR">Oriya - (ଓଡ଼ିଆ)</option>
              <option value="OM">Oromo - (Afaan Oromoo)</option>
              <option value="OS">Ossetian - (Ирон æвзаг)</option>
              <option value="PS">Pashto - (پښتو)</option>
              <option value="FA">Persian - (فارسی)</option>
              <option value="PL">Polish - (Polski)</option>
              <option value="PT">Portuguese - (Português)</option>
              <option value="PT-BR">Portuguese Brazil - (Português Brasil)</option>
              <option value="PT-PT">Portuguese Portugal - (Português Portugal)</option>
              <option value="PA">Punjabi - (ਪੰਜਾਬੀ)</option>
              <option value="QU">Quechua - (Runa Simi)</option>
              <option value="RO">Romanian - (Română)</option>
              <option value="MO">Romanian Moldova - (Română Moldova)</option>
              <option value="RM">Romansh - (Rumantsch)</option>
              <option value="RU">Russian - (Русский)</option>
              <option value="SM">Samoan - (Gagana Samoa)</option>
              <option value="SAT">Santali - (ᱥᱟᱱᱛᱟᱲᱤ)</option>
              <option value="SC">Sardinian - (Sardu)</option>
              <option value="GD">Scottish Gaelic - (Gàidhlig)</option>
              <option value="SR">Serbian - (Српски)</option>
              <option value="SH">Serbo_Croatian - (Srpskohrvatski)</option>
              <option value="SN">Shona - (ChiShona)</option>
              <option value="SD">Sindhi - (سنڌي)</option>
              <option value="SI">Sinhala - (සිංහල)</option>
              <option value="SK">Slovak - (Slovenčina)</option>
              <option value="SL">Slovenian - (Slovenščina)</option>
              <option value="SO">Somali - (Soomaali)</option>
              <option value="ST">Southern - Sotho (Sesotho)</option>
              <option value="ES">Spanish - (Español)</option>
              <option value="ES-AR">Spanish Argentina - (Español Argentina)</option>
              <option value="ES-419">Spanish Latin America - (Español Latinoamérica)</option>
              <option value="ES-MX">Spanish Mexico - (Español México)</option>
              <option value="ES-ES">Spanish Spain - (Español España)</option>
              <option value="ES-US">Spanish United States - (Español Estados Unidos)</option>
              <option value="SU">Sundanese - (Basa Sunda)</option>
              <option value="SW">Swahili - (Kiswahili)</option>
              <option value="SV">Swedish - (Svenska)</option>
              <option value="TG">Tajik - (Тоҷикӣ)</option>
              <option value="TA">Tamil - (தமிழ்)</option>
              <option value="TT">Tatar - (Татар)</option>
              <option value="TE">Telugu - (తెలుగు)</option>
              <option value="TH">Thai - (ไทย)</option>
              <option value="TI">Tigrinya - (ትግርኛ)</option>
              <option value="TO">Tongan - (Lea fakatonga)</option>
              <option value="TN">Tswana - (Setswana)</option>
              <option value="TR">Turkish - (Türkçe)</option>
              <option value="TK">Turkmen - (Türkmençe)</option>
              <option value="TW">Twi - (Twi)</option>
              <option value="UDM">Udmurt - (Удмурт кыл)</option>
              <option value="UK">Ukrainian - (Українська)</option>
              <option value="UR">Urdu - (اردو)</option>
              <option value="UG">Uyghur - (ئۇيغۇرچە)</option>
              <option value="UZ">Uzbek - (O'zbek)</option>
              <option value="VE">Venda - (Tshivenḓa)</option>
              <option value="VI">Vietnamese - (Tiếng Việt)</option>
              <option value="WA">Walloon - (Walon)</option>
              <option value="CY">Welsh - (Cymraeg)</option>
              <option value="FY">Western Frisian - (Frysk)</option>
              <option value="WO">Wolof - (Wollof)</option>
              <option value="XH">Xhosa - (isiXhosa)</option>
              <option value="YI">Yiddish - (ייִדיש)</option>
              <option value="YO">Yoruba - (Èdè Yorùbá)</option>
              <option value="ZA">Zhuang - (Saɯ cueŋƅ)</option>
              <option value="ZU">Zulu - (isiZulu)</option>
            </select>
          </div>

          <!-- Champ version -->
          <div class="field">
            <label for="version">Version</label>
            <select id="version" v-model="version">
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

          <!-- <div class="field">
            <label>Guide's games</label>
            <MultiSelect
              :maxSelectedLabels="4"
              id="games_label"
              v-model="selectedGameIds"
              :options="availableGames"
              optionLabel="title"
              optionValue="id"
              display="chip"
              placeholder="Select games"
              :showClear="true"
              class="p-multiselect-field"
            >
              <template #option="slotProps">
                <div class="game-option">
                  <i class="pi pi-gamepad2"></i>
                  <span>{{ slotProps.option.title }}</span>
                </div>
              </template>
            </MultiSelect>
          </div> -->

          <div class="field">
            <label for="cover">Cover image</label>

            <!-- Zone de prévisualisation (cliquable) -->
            <div class="cover-preview-wrapper" @click="triggerFileInput">
              <img
                v-if="coverPreview"
                :src="coverPreview"
                alt="Cover Preview"
                class="cover-preview-img"
              />
              <div v-else class="cover-placeholder">
                <i class="pi pi-image"></i>
                <span>New file...</span>
              </div>
            </div>

            <!-- Input file (caché) -->
            <input
              id="cover"
              type="file"
              accept="image/webp,image/png,image/jpeg/pdf"
              @change="handleFileChange"
              class="file-input"
            />

            <p class="file-hint">Accepted format : WEBP, PNG, JPEG, PDF (max 10 MB)</p>
          </div>
        </div>

        <div class="actions-row">
          <SubmitButton
            label="Cancel"
            icon="pi pi-times"
            variant="secondary"
            type="button"
            @click="emit('navigate', 'list-guides')"
          />
          <SubmitButton
            id="btn-save-info"
            :label="infoLoading ? 'Saving...' : 'Save'"
            :disabled="infoLoading"
            icon="pi pi-save"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>

    <!-- **************** Onglet "Contenu du guide **************** -->
    <div v-if="currentTab === 'contentOfGuide'" class="tab-content">
      <form @submit.prevent="submitContent" class="content-guide-form">
        <h2>Content</h2>

        <!-- Message pour mobile/tablette -->
        <div class="mobile-steps-message">
          <div class="mobile-message-card">
            <i class="pi pi-desktop"></i>
            <h3>Desktop Required</h3>
            <p>
              The guide content editor is only available on desktop devices for optimal user
              experience. Please use a computer to edit your guide content.
            </p>
            <div class="mobile-message-actions">
              <button @click="currentTab = 'info'" class="mobile-back-button">
                <i class="pi pi-arrow-left"></i>
                Back to Informations
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu desktop -->
        <div class="desktop-steps-content">
          <!-- Sélecteur de pièces jointes -->
          <div class="attachments-section">
            <h3>Available Attachments</h3>
            <div class="attachments-selector">
              <MultiSelect
                :maxSelectedLabels="4"
                v-model="selectedAttachments"
                :options="userStore.attachmentsCreated"
                optionLabel="fileName"
                optionValue="id"
                display="chip"
                placeholder="Select attachments to insert"
                :showClear="true"
                class="attachments-multiselect"
              >
                <template #option="slotProps">
                  <div class="attachment-option">
                    <i :class="getAttachmentIcon(slotProps.option.type)"></i>
                    <div class="attachment-info">
                      <span class="attachment-name">{{ slotProps.option.fileName }}</span>
                      <small class="attachment-type">{{ slotProps.option.type }}</small>
                    </div>
                  </div>
                </template>
                <template #chip="slotProps">
                  <div class="attachment-chip">
                    <i :class="getAttachmentIcon(getAttachmentById(slotProps.value)?.type)"></i>
                    <span>{{ getAttachmentById(slotProps.value)?.fileName }}</span>
                  </div>
                </template>
              </MultiSelect>

              <button
                type="button"
                @click="insertSelectedAttachments"
                :disabled="!selectedAttachments.length"
                class="insert-attachments-btn"
              >
                <i class="pi pi-plus"></i>
                Insert Selected ({{ selectedAttachments.length }})
              </button>
            </div>
          </div>

          <!-- Éditeur TipTap -->
          <div class="editor-section">
            <h3>Guide Content</h3>

            <!-- Barre d'outils -->
            <div v-if="editor" class="editor-toolbar">
              <!-- Groupe Undo/Redo -->
              <button
                type="button"
                @click="editor.chain().focus().undo().run()"
                :disabled="!editor.can().undo()"
                class="toolbar-btn"
                title="Undo"
              >
                <i class="pi pi-times"></i>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().redo().run()"
                :disabled="!editor.can().redo()"
                class="toolbar-btn"
                title="Redo"
              >
                <i class="pi pi-check"></i>
              </button>

              <div class="toolbar-divider"></div>

              <!-- Groupe Formatage de base -->
              <button
                type="button"
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
                class="toolbar-btn"
                title="Bold"
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
                class="toolbar-btn"
                title="Italic"
              >
                <strong>I</strong>
                <!-- <i class="pi pi-italic"></i> -->
              </button>

              <button
                type="button"
                @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }"
                class="toolbar-btn"
                title="Strike"
              >
                <i class="pi pi-minus"></i>
              </button>

              <div class="toolbar-divider"></div>

              <!-- Sélecteur de police -->
              <select @change="changeFontFamily($event)" class="toolbar-select" title="Font Family">
                <option value="">Font Family</option>
                <option value="Inter">Inter</option>
                <option value="'Comic Sans MS'">Comic Sans</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="'Arial'">Arial</option>
              </select>

              <!-- Sélecteur de couleur -->
              <input
                type="color"
                @input="editor.chain().focus().setColor($event.target.value).run()"
                :value="editor.getAttributes('textStyle').color || '#fef9e7'"
                class="toolbar-color"
                title="Text Color"
              />

              <div class="toolbar-divider"></div>

              <!-- Groupe Titres -->
              <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                class="toolbar-btn"
                title="Heading 1"
              >
                H1
              </button>

              <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                class="toolbar-btn"
                title="Heading 2"
              >
                H2
              </button>

              <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                class="toolbar-btn"
                title="Heading 3"
              >
                H3
              </button>

              <div class="toolbar-divider"></div>

              <!-- Groupe Alignement -->
              <button
                type="button"
                @click="editor.chain().focus().setTextAlign('left').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
                class="toolbar-btn"
                title="Align Left"
              >
                <i class="pi pi-align-left"></i>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
                class="toolbar-btn"
                title="Align Center"
              >
                <i class="pi pi-align-center"></i>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
                class="toolbar-btn"
                title="Align Right"
              >
                <i class="pi pi-align-right"></i>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().setTextAlign('justify').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
                class="toolbar-btn"
                title="Justify"
              >
                <i class="pi pi-align-justify"></i>
              </button>

              <div class="toolbar-divider"></div>

              <!-- Groupe Listes -->
              <button
                type="button"
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
                class="toolbar-btn"
                title="Bullet List"
              >
                <i class="pi pi-list"></i>
              </button>

              <button
                type="button"
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }"
                class="toolbar-btn"
                title="Ordered List"
              >
                <i class="pi pi-sort-numeric-up"></i>
              </button>
            </div>

            <!-- Zone d'édition avec menus contextuels -->
            <div class="editor-wrapper">
              <!-- Bubble Menu (menu contextuel au survol de sélection) -->
              <BubbleMenu
                :editor="editor"
                :tippy-options="{ duration: 100 }"
                v-if="editor"
                class="bubble-menu"
              >
                <button
                  type="button"
                  @click="editor.chain().focus().toggleBold().run()"
                  :class="{ 'is-active': editor.isActive('bold') }"
                  class="bubble-btn"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :class="{ 'is-active': editor.isActive('italic') }"
                  class="bubble-btn"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  @click="editor.chain().focus().toggleStrike().run()"
                  :class="{ 'is-active': editor.isActive('strike') }"
                  class="bubble-btn"
                >
                  <span style="text-decoration: line-through">S</span>
                </button>
              </BubbleMenu>

              <!-- Floating Menu (menu flottant sur ligne vide) -->
              <FloatingMenu
                :editor="editor"
                :tippy-options="{ duration: 100 }"
                v-if="editor"
                class="floating-menu"
              >
                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                  :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                  class="floating-btn"
                >
                  H1
                </button>
                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                  class="floating-btn"
                >
                  H2
                </button>
                <button
                  type="button"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :class="{ 'is-active': editor.isActive('bulletList') }"
                  class="floating-btn"
                >
                  <i class="pi pi-list"></i>
                </button>
              </FloatingMenu>

              <EditorContent :editor="editor" class="editor-content" />
            </div>

            <!-- Zone d'édition -->
            <!-- <div class="editor-wrapper">
              <EditorContent :editor="editor" class="editor-content" />
            </div> -->

            <!-- Compteur de mots -->
            <div class="editor-stats">
              <span class="word-count">{{ wordCount }} words</span>
              <span class="read-time">≈ {{ estimatedReadTime }} min read</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="content-actions">
            <SubmitButton
              label="Cancel"
              icon="pi pi-times"
              variant="secondary"
              type="button"
              @click="currentTab = 'info'"
            />
            <SubmitButton
              :label="contentOfGuideLoading ? 'Saving...' : 'Save Content'"
              :disabled="contentOfGuideLoading"
              icon="pi pi-save"
              variant="primary"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'
import type { Guide } from '@/types/collections'
import MultiSelect from 'primevue/multiselect'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Color from '@tiptap/extension-color'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'

const toast = useToast()
const userStore = useUserStore()

// Props & Événements
const props = defineProps<{
  guide: Guide
}>()
const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

// Onglets
const currentTab = ref<'info' | 'contentOfGuide'>('info')

/* +++++++++++++++++++++++++++++ INFOS DE BASE +++++++++++++++++++++++++++++ */

const infoLoading = ref(false)
const title = ref(props.guide.title)
const subTitle = ref(props.guide.subTitle || '')
const description = ref(props.guide.description)
const difficulty = ref(props.guide.difficulty)
const language = ref(props.guide.language)
const version = ref(props.guide.version)
const coverFile = ref<File | null>(null)
const published = ref(props.guide.published || false)
// const premium = ref(props.guide.premium || false)
const selectedGameIds = ref<string[]>([])
// const availableGames = computed(() => userStore.games || [])

// Récupération de données
onMounted(async () => {
  coverPreview.value = props.guide.cover || null

  // if (!userStore.games?.length) {
  //   await userStore.fetchAllGames()
  // }
  // if (props.guide.Games?.length) {
  //   selectedGameIds.value = props.guide.Games
  // }
})

// URL de prévisualisation de la couverture
const coverPreview = ref<string | null>(null)

// Gestion de l'image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validation taille et type
  if (file.size > 10 * 1024 * 1024) {
    toast.error('The size must be < 10 MB.')
    return
  }
  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    toast.error('Invalide format (WEBP, PNG, JPEG).')
    return
  }

  // Enregistrer le fichier sélectionné
  coverFile.value = file

  // Générer une URL locale pour affichage de prévisualisation
  coverPreview.value = URL.createObjectURL(file)
}

// Changement de l'image
function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

// Validation formulaire (informations de bases)
async function submitInfo() {
  if (infoLoading.value) return
  infoLoading.value = true

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('subTitle', subTitle.value)
    formData.append('description', description.value)
    formData.append('difficulty', difficulty.value)
    formData.append('language', language.value)
    formData.append('version', version.value)
    formData.append('published', published.value.toString())
    // formData.append('premium', premium.value.toString())
    // Ne pas inclure Games dans FormData car le backend les gère séparément

    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    const infoResponse = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide/${props.guide.id}/info`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: formData,
      },
    )

    if (!infoResponse.ok) {
      throw new Error(`HTTP error! status: ${infoResponse.status}`)
    }

    // Mettre à jour les jeux avec un call API séparé
    const gamesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide/${props.guide.id}/games`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({
          Games: selectedGameIds.value,
        }),
      },
    )

    if (!gamesResponse.ok) {
      throw new Error(`Failed to update games association`)
    }

    toast.success('Guide updated successfully!')
    await userStore.fetchUserGuides()
    emit('navigate', 'list-guides')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Error during update')
  } finally {
    infoLoading.value = false
  }
}

/* +++++++++++++++++++++++++++++ CONTENU DU GUIDE +++++++++++++++++++++++++++++ */

const contentOfGuideLoading = ref(false)
const selectedAttachments = ref<string[]>([])
const wordCount = ref(0)
const estimatedReadTime = ref(1)

// Configuration de l'éditeur TipTap
const editor = useEditor({
  content: props.guide.content || '<p>Start writing your guide content...</p>',
  extensions: [
    StarterKit.configure({
      // Désactiver History du StarterKit car on utilisera l'extension séparée
      history: false,
    }),
    Image.configure({
      inline: true,
      allowBase64: false,
    }),
    Placeholder.configure({
      placeholder: 'Start writing your guide content...',
    }),
    FontFamily.configure({
      types: ['textStyle'],
    }),
    TextStyle,
    Color.configure({
      types: ['textStyle'],
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Typography,
    Gapcursor,
    History.configure({
      depth: 10, // Nombre d'étapes d'annulation maximum
    }),
  ],
  onUpdate: ({ editor }) => {
    // Calculer le nombre de mots et le temps de lecture
    const text = editor.getText()
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    wordCount.value = words.length
    estimatedReadTime.value = Math.max(1, Math.ceil(words.length / 200))
  },
})

// Fonction pour obtenir l'icône selon le type d'attachment
function getAttachmentIcon(type: string | undefined): string {
  switch (type) {
    case 'image':
      return 'pi pi-image'
    case 'document':
      return 'pi pi-file'
    case 'video':
      return 'pi pi-video'
    default:
      return 'pi pi-file'
  }
}

// Fonction pour récupérer un attachment par son ID
function getAttachmentById(id: string) {
  return userStore.attachmentsCreated.find((attachment) => attachment.id === id)
}

// Fonction pour insérer les attachments sélectionnés dans l'éditeur
function insertSelectedAttachments() {
  if (!editor.value || !selectedAttachments.value.length) return

  selectedAttachments.value.forEach((attachmentId) => {
    const attachment = getAttachmentById(attachmentId)
    if (!attachment) return

    if (attachment.type === 'image') {
      // Insérer une image avec attributs optimisés
      editor.value
        ?.chain()
        .focus()
        .setImage({
          src: attachment.url,
          alt: attachment.alt || attachment.fileName,
          title: attachment.caption || attachment.fileName,
        })
        .run()
    } else {
      // Créer un lien stylisé pour les documents/vidéos
      const linkText = attachment.fileName
      const fileExtension = attachment.fileName.split('.').pop()?.toLowerCase()

      let icon = ''
      switch (fileExtension) {
        case 'pdf':
          icon = '📄 '
          break
        case 'doc':
        case 'docx':
          icon = '📝 '
          break
        case 'txt':
          icon = '📄 '
          break
        case 'mp4':
        case 'webm':
          icon = '🎥 '
          break
        default:
          icon = '📎 '
      }

      editor.value
        ?.chain()
        .focus()
        .insertContent(
          `<p><a href="${attachment.url}" target="_blank" rel="noopener" class="attachment-link">${icon}${linkText}</a></p>`,
        )
        .run()
    }
  })

  // Vider la sélection après insertion
  selectedAttachments.value = []

  // Message de confirmation
  toast.success(`${selectedAttachments.value.length} attachment(s) inserted successfully!`)
}

// Ajouter cette fonction après les autres fonctions
function changeFontFamily(event: Event) {
  const target = event.target as HTMLSelectElement
  const fontFamily = target.value

  if (fontFamily && editor.value) {
    editor.value.chain().focus().setFontFamily(fontFamily).run()
  } else if (editor.value) {
    editor.value.chain().focus().unsetFontFamily().run()
  }
}

// Fonction de soumission du contenu
async function submitContent() {
  if (contentOfGuideLoading.value || !editor.value) return
  contentOfGuideLoading.value = true

  try {
    const content = editor.value.getHTML()

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide/${props.guide.id}/content`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({ content }),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    toast.success('Guide content updated successfully!')
    await userStore.fetchUserGuides()
    emit('navigate', 'list-guides')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Error updating content')
  } finally {
    contentOfGuideLoading.value = false
  }
}

// Nettoyer l'éditeur au démontage du composant
onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.update-guide-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 1rem;
}

/* Onglets */
.tabs {
  display: flex;
  border-bottom: 2px solid var(--color-medium-gray);
  margin-bottom: var(--spacing-xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: 0 var(--spacing-md);
}

.tab-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: var(--color-light-gray);
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: var(--color-cream);
}

.tab-button.active {
  border-bottom-color: var(--color-gold);
  color: var(--color-gold);
}

/* Améliorer le titre de l'onglet étapes */
.tab-content h2 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
}

/* Contenu */
.tab-content {
  margin-top: 1rem;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}
.field-row {
  display: flex;
  gap: 2rem;
}
.switch-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.switch-button {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.switch-button.active {
  background: var(--color-gold);
}
.switch-handle {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}
.switch-button.active .switch-handle {
  transform: translateX(20px);
}
.file-input-wrapper {
  position: relative;
}
.file-input {
  display: none;
}
.file-input-button {
  padding: 0.5rem 1rem;
  border: 1px dashed #aaa;
  background: none;
  cursor: pointer;
}
.file-hint {
  font-size: 0.8rem;
  color: #666;
}

.actions-row,
.contentOfGuide-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}
.contentOfGuide-actions {
  margin-bottom: 1rem;
}
.contentOfGuide-save {
  margin-left: auto;
}

.add-icon {
  color: var(--color-gold);
}

/* Conteneur général */
.update-guide-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Titres de section */
.update-guide-form h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  font-weight: bold;
}

/* Groupe de champs (label + input/textarea) */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
  min-width: 0;
  overflow: hidden;
}
.field label {
  display: block;
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
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
.field input,
.field select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
}

/* Rangée de toggles */
.field-row {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.switch-field label {
  font-size: var(--font-size-base);
  color: var(--color-darker-gray);
}
.switch-button {
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border-radius: var(--radius-full);
  position: relative;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}
.switch-button.active {
  background: var(--color-gold);
}
.switch-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}
.switch-button.active .switch-handle {
  transform: translateX(24px);
}

/* Override Multiselect styles */
.multiselect-field {
  width: 100%;
}

/* Supprimer les puces de liste */
.multiselect-field ul,
.multiselect-field li,
.p-multiselect ul,
.p-multiselect li {
  list-style: none !important;
  list-style-type: none !important;
}

.multiselect-field .multiselect__content-wrapper {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
}

.multiselect-field .multiselect__option {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: none;
  list-style: none;
}

.multiselect-field .multiselect__option--highlight {
  background: var(--color-dark-gray);
  color: var(--color-gold);
}

/* Upload d’image */
.file-input-wrapper {
  position: relative;
}
.file-input {
  display: none;
}
.file-input-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px dashed var(--color-gold);
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  color: var(--color-white);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.file-input-button:hover {
  background: var(--color-cream);
  color: var(--color-darker-charcoal);
  border: 2px solid var(--color-dark-gray);
}
.file-hint {
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin-top: var(--spacing-xs);
}

/* Boutons d’action */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}
.actions-row button {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}

/* Bouton Annuler */
.actions-row .pi-times {
  margin-right: var(--spacing-xs);
}
.actions-row button[variant='secondary'] {
  background: var(--color-off-white);
  color: var(--color-medium-gray);
  padding: var(--spacing-md) var(--spacing-xl);
}
.actions-row button[variant='secondary']:hover {
  background: var(--color-light-gray);
}

/* Bouton Enregistrer */
.actions-row #btn-save-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.actions-row #btn-save-info:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}
.actions-row #btn-save-info:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Par défaut, masquer le message mobile et afficher le contenu desktop */
.mobile-steps-message {
  display: none;
}

.desktop-steps-content {
  display: block;
}

/* Styles du message mobile */
.mobile-message-card {
  background: var(--color-charcoal);
  border: 2px solid var(--color-gold);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  margin: var(--spacing-xl) auto;
  max-width: 500px;
}

.mobile-message-card i {
  font-size: 3rem;
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.mobile-message-card h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin: 0 0 var(--spacing-md) 0;
}

.mobile-message-card p {
  color: var(--color-cream);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0 0 var(--spacing-lg) 0;
}

.mobile-message-actions {
  margin-top: var(--spacing-lg);
}

.mobile-back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-primary);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-back-button:hover {
  background: var(--color-light-yellow);
  transform: translateY(-2px);
}

/* === Styles pour la prévisualisation de la couverture === */
.cover-preview-wrapper {
  width: 200px;
  height: 120px;
  border: 2px dashed var(--color-medium-gray);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: var(--color-off-white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-preview-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s;
}

.cover-placeholder {
  text-align: center;
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
}
.cover-placeholder i {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xs);
  display: block;
}

/* === CONTENU DU GUIDE === */
.content-guide-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.content-guide-form h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  font-weight: bold;
  margin-bottom: var(--spacing-xl);
}

/* === SECTION ATTACHMENTS === */
.attachments-section {
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-medium-gray);
}

.attachments-section h3 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
}

.attachments-selector {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
}

.attachments-multiselect {
  flex: 1;
  min-width: 0;
}

.attachment-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.attachment-info {
  display: flex;
  flex-direction: column;
}

.attachment-name {
  font-weight: bold;
  color: var(--color-cream);
}

.attachment-type {
  color: var(--color-medium-gray);
  text-transform: uppercase;
  font-size: var(--font-size-xs);
}

.attachment-chip {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-gold);
  color: var(--color-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: bold;
}

.insert-attachments-btn {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-primary);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: nowrap;
}

.insert-attachments-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.insert-attachments-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* === SECTION ÉDITEUR === */
.editor-section {
  margin-bottom: var(--spacing-xl);
}

.editor-section h3 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
}

/* Barre d'outils */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  flex-wrap: wrap;
}

.toolbar-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-cream);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-primary);
  font-weight: bold;
  font-size: var(--font-size-sm);
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background: var(--color-dark-gray);
  border-color: var(--color-gold);
}

.toolbar-btn.is-active {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-medium-gray);
  margin: 0 var(--spacing-xs);
}

/* Zone d'édition */
.editor-wrapper {
  border: 1px solid var(--color-medium-gray);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  background: var(--color-dark-gray);
  min-height: 400px;
  overflow: hidden;
  padding: 0 var(--spacing-xl);
}

.editor-content {
  min-height: 400px;
}

.editor-content .ProseMirror img {
  max-width: 400px !important;
  max-height: 400px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: var(--spacing-sm) 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.editor-content .ProseMirror img:hover {
  border-color: var(--color-gold);
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.25);
}

.editor-content .ProseMirror a.attachment-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-gold);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid var(--color-gold);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin: var(--spacing-md) 0;
  text-decoration: none;
  font-weight: 600;
  font-family: var(--font-primary);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.editor-content .ProseMirror a.attachment-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.editor-content .ProseMirror a.attachment-link:hover::before {
  left: 100%;
}

.editor-content .ProseMirror a.attachment-link:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
}

/* Styles pour le contenu de l'éditeur */
.editor-content .ProseMirror {
  padding: var(--spacing-lg);
  outline: none;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  min-height: 350px;
}

.editor-content .ProseMirror p {
  margin: 0 0 var(--spacing-md) 0;
}

.editor-content .ProseMirror h1,
.editor-content .ProseMirror h2,
.editor-content .ProseMirror h3 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-weight: bold;
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
}

.editor-content .ProseMirror h1 {
  font-size: var(--font-size-2xl);
}

.editor-content .ProseMirror h2 {
  font-size: var(--font-size-xl);
}

.editor-content .ProseMirror h3 {
  font-size: var(--font-size-lg);
}

.editor-content .ProseMirror strong {
  color: var(--color-gold);
  font-weight: bold;
}

.editor-content .ProseMirror em {
  color: var(--color-light-yellow);
  font-style: italic;
}

.editor-content .ProseMirror ul,
.editor-content .ProseMirror ol {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-xl);
}

.editor-content .ProseMirror li {
  margin: var(--spacing-xs) 0;
}

.editor-content .ProseMirror img {
  max-width: 100%;
  width: auto;
  height: auto;
  max-height: 400px;
  object-fit: contain; /* Préserve les proportions */
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) auto;
  display: block;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border: 3px solid var(--color-medium-gray);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-white); /* Fond blanc pour les images avec transparence */
  padding: var(--spacing-xs);
  /* max-width: 100%;
  height: auto;
  max-height: 400px; // Hauteur maximum pour éviter les débordements
  border-radius: var(--radius-md);
  margin: var(--spacing-md) 0;
  display: block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--color-medium-gray);
  transition: all 0.3s ease;
  cursor: pointer; */
}

.editor-content .ProseMirror img:hover {
  border-color: var(--color-gold);
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
}

.editor-content .ProseMirror a {
  color: var(--color-gold);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 215, 0, 0.1);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gold);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs) 0;
  transition: all 0.2s ease;
  font-weight: 500;
}

.editor-content .ProseMirror a:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

/* Ajouter une icône aux liens automatiquement */
.editor-content .ProseMirror a[href*='pdf']::before,
.editor-content .ProseMirror a[href*='doc']::before,
.editor-content .ProseMirror a[href*='txt']::before {
  content: '📄';
  margin-right: var(--spacing-xs);
}

.editor-content .ProseMirror a[href*='mp4']::before,
.editor-content .ProseMirror a[href*='webm']::before {
  content: '🎥';
  margin-right: var(--spacing-xs);
}

/* Styles pour les images sélectionnées */
.editor-content .ProseMirror img.ProseMirror-selectednode {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
}

/* Conteneur pour centrer les images si nécessaire */
.editor-content .ProseMirror p:has(img) {
  text-align: center;
}

.editor-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-medium-gray);
  pointer-events: none;
  height: 100px;
}

/* Statistiques de l'éditeur */
.editor-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
}

.word-count,
.read-time {
  font-family: var(--font-primary);
  font-weight: bold;
}

/* Actions */
.content-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.toolbar-select {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  min-width: 120px;
}

.toolbar-select:hover {
  border-color: var(--color-gold);
}

.toolbar-color {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  padding: 2px;
}

.toolbar-color:hover {
  border-color: var(--color-gold);
}

/* Styles pour les boutons disabled */
.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn:disabled:hover {
  background: transparent;
  border-color: transparent;
}

/* Bubble Menu (menu contextuel) */
.bubble-menu {
  display: flex;
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);
  z-index: 1000;
}

.bubble-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  color: var(--color-cream);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-weight: bold;
  font-size: var(--font-size-sm);
}

.bubble-btn:hover {
  background: var(--color-charcoal);
  border-color: var(--color-gold);
}

.bubble-btn.is-active {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

/* Floating Menu (menu flottant) */
.floating-menu {
  display: flex;
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.floating-menu:hover {
  opacity: 1;
}

.floating-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  color: var(--color-cream);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-primary);
  font-weight: bold;
  font-size: var(--font-size-sm);
}

.floating-btn:hover {
  background: var(--color-dark-gray);
  border-color: var(--color-gold);
}

.floating-btn.is-active {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

/* Amélioration des styles du contenu de l'éditeur */
.editor-content .ProseMirror[contenteditable='true'] {
  outline: none;
}

/* Styles pour l'alignement du texte */
.editor-content .ProseMirror .has-focus {
  border-radius: var(--radius-sm);
}

.editor-content .ProseMirror p[style*='text-align: center'] {
  text-align: center;
}

.editor-content .ProseMirror p[style*='text-align: right'] {
  text-align: right;
}

.editor-content .ProseMirror p[style*='text-align: justify'] {
  text-align: justify;
}

/* Styles pour les différentes polices */
.editor-content .ProseMirror [style*='font-family: Inter'] {
  font-family: Inter, sans-serif;
}

.editor-content .ProseMirror [style*="font-family: 'Comic Sans MS'"] {
  font-family: 'Comic Sans MS', cursive;
}

.editor-content .ProseMirror [style*='font-family: serif'] {
  font-family: serif;
}

.editor-content .ProseMirror [style*='font-family: monospace'] {
  font-family: monospace;
}

.editor-content .ProseMirror [style*='font-family: cursive'] {
  font-family: cursive;
}

.toolbar-btn strong,
.bubble-btn strong,
.floating-btn strong {
  font-family: var(--font-primary);
  font-weight: 900;
  font-size: var(--font-size-sm);
}

.toolbar-btn em,
.bubble-btn em {
  font-family: var(--font-primary);
  font-style: italic;
  font-size: var(--font-size-sm);
}

.toolbar-btn span,
.bubble-btn span {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
}

/* Améliorer la visibilité des boutons actifs avec icônes textuelles */
.toolbar-btn.is-active strong,
.bubble-btn.is-active strong,
.toolbar-btn.is-active em,
.bubble-btn.is-active em,
.toolbar-btn.is-active span,
.bubble-btn.is-active span {
  color: inherit;
}

/* Responsive général */
@media (max-width: 1024px) {
  .update-guide-container {
    padding: var(--spacing-md);
  }

  .tabs {
    padding: 0 var(--spacing-sm);
  }

  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  /* Sur tablette et mobile, masquer le contenu desktop et afficher le message */
  .mobile-steps-message {
    display: block;
  }

  .desktop-steps-content {
    display: none;
  }

  .attachments-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .insert-attachments-btn {
    justify-content: center;
  }

  .editor-toolbar {
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .toolbar-select {
    min-width: 100px;
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 768px) {
  .update-guide-container {
    padding: var(--spacing-sm);
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  /* Onglet Informations - Responsive */
  .update-guide-form {
    padding: var(--spacing-lg);
    margin: 0;
    width: 100%;
  }

  .form-section {
    gap: var(--spacing-md);
  }

  .field {
    gap: var(--spacing-xs);
  }

  .update-guide-form h2 {
    font-size: var(--font-size-xl);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  /* Réorganiser les switchs en colonne sur mobile */
  .field-row {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  /* Adapter la prévisualisation de couverture */
  .cover-preview-wrapper {
    width: 100%;
    max-width: 300px;
    height: 180px;
    margin: 0 auto;
  }

  /* Réorganiser les boutons d'action */
  .actions-row {
    flex-direction: column-reverse;
    gap: var(--spacing-md);
  }

  .actions-row button {
    width: 100%;
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
  }

  .mobile-message-card {
    margin: var(--spacing-lg) auto;
    padding: var(--spacing-xl);
  }

  .mobile-message-card i {
    font-size: 2.5rem;
  }

  .mobile-message-card h3 {
    font-size: var(--font-size-lg);
  }

  .mobile-message-card p {
    font-size: var(--font-size-sm);
  }

  .content-guide-form {
    padding: var(--spacing-lg);
  }

  .attachments-section {
    padding: var(--spacing-md);
  }

  .editor-content .ProseMirror {
    padding: var(--spacing-md);
    min-height: 300px;
  }

  .editor-wrapper {
    min-height: 300px;
  }

  .content-actions {
    flex-direction: column-reverse;
  }

  .content-actions button {
    width: 100%;
  }

  .editor-toolbar {
    padding: var(--spacing-xs);
    justify-content: center;
  }

  .toolbar-btn {
    min-width: 28px;
    height: 28px;
    padding: var(--spacing-xs);
  }

  .toolbar-select {
    min-width: 80px;
  }

  /* Masquer certains éléments sur mobile pour économiser l'espace */
  .toolbar-divider:nth-of-type(n + 3) {
    display: none;
  }

  .editor-content .ProseMirror img {
    max-width: 300px !important;
    max-height: 300px !important;
  }
}

@media (max-width: 576px) {
  .tabs {
    padding: 0;
  }

  .tab-button {
    flex: 1;
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .update-guide-container {
    padding: var(--spacing-xs);
  }

  .update-guide-form {
    padding: var(--spacing-md);
  }

  .update-guide-form h2 {
    font-size: var(--font-size-lg);
  }

  /* Adapter les champs pour très petits écrans */
  .field input,
  .field textarea {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .field label {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }

  /* Adapter la taille des switchs */
  .switch-button {
    width: 40px;
    height: 20px;
  }

  .switch-handle {
    width: 16px;
    height: 16px;
  }

  .switch-button.active .switch-handle {
    transform: translateX(20px);
  }

  /* Couverture plus petite sur très petits écrans */
  .cover-preview-wrapper {
    width: 100%;
    height: 150px;
  }

  .mobile-message-card {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .mobile-back-button {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .editor-content .ProseMirror img {
    max-width: 250px !important;
    max-height: 250px !important;
  }

  .editor-content .ProseMirror a {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs);
  }
}
</style>
