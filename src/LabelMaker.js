import React, { useEffect, useMemo, useState } from "react";
import "./LabelMaker.css";

/* ==========================
   КОНСТАНТЫ И ХЕЛПЕРЫ
   ========================== */

const STORAGE_KEY = "hb-label-template-v1";     // последний использованный конфиг
const PROFILES_KEY = "hb-label-profiles-v1";   // список сохранённых профилей
const DEFAULT_LOGO_URL = `${process.env.PUBLIC_URL}/qr-code.png`;
const DOP_LOGO_URL = `${process.env.PUBLIC_URL}/NutsFREE.png`;


// форматирование даты
function formatDate(date, format) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  switch (format) {
    case "eu":
      return `${dd}.${mm}.${yyyy}`;
    case "iso":
      return `${yyyy}-${mm}-${dd}`;
    case "us":
    default:
      return `${mm}/${dd}/${yyyy}`;
  }
}

const WEIGHT_PRESETS = [
  {
    id: "45",
    label: "45 g (текущая этикетка)",
    weight: "45g",
    tolerance: "+/-5g",
    calories: "Calories: 151 kcal",
  },
  {
    id: "85",
    label: "85 g",
    weight: "85g",
    tolerance: "+/-5g",
    calories: "Calories per 100g: 370 kcal",
  },
  {
    id: "custom",
    label: "Свои значения",
  },
];

// собрать объект конфига из стейта
function buildConfigFromState(state) {
  const {
    brand,
    subtitle,
    ingredients,
    calories,
    storage,
    mfgDate,
    shelfLifeDays,
    dateFormat,
    website,
    email,
    instagram,
    note,
    weightPreset,
    weight,
    tolerance,
    origin,
    logoSizeMM,
    count,
    cols,
    labelWidthMM,
    labelHeightMM,
    topOffsetMM,
    leftOffsetMM,
    horizontalGapMM,
    verticalGapMM,
    badgeUrl,
    badgeSizeMM,
    } = state;

  return {
    brand,
    subtitle,
    ingredients,
    calories,
    storage,
    mfgDate,
    shelfLifeDays,
    dateFormat,
    website,
    email,
    instagram,
    note,
    weightPreset,
    weight,
    tolerance,
    origin,
    logoSizeMM,
    count,
    cols,
    labelWidthMM,
    labelHeightMM,
    topOffsetMM,
    leftOffsetMM,
    horizontalGapMM,
    verticalGapMM,
    badgeUrl,
    badgeSizeMM,
  };
}

/* ==========================
   ГЛАВНЫЙ КОМПОНЕНТ
   ========================== */

export default function LabelMaker() {
  /* --- ОСНОВНОЙ ТЕКСТ --- */
  const [brand, setBrand] = useState('"Honey Bunny"');
  const [subtitle, setSubtitle] = useState("Handmade cookies by Olha Moroz");
  const [ingredients, setIngredients] = useState(
    "Ingredients: flour, natural honey, butter, sugar, powdered sugar, eggs, soda, spices (cinnamon, ginger, cloves), food coloring."
  );
  const [calories, setCalories] = useState("Calories: 151 kcal");
  const [storage, setStorage] = useState(
    "Keep in a cool (+18°C (+/-5), dry place (less 75%)."
  );

  /* --- ДАТЫ --- */
  const [mfgDate, setMfgDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [shelfLifeDays, setShelfLifeDays] = useState(180);
  const [dateFormat, setDateFormat] = useState("us");

  /* --- КОНТАКТЫ --- */
  const [website, setWebsite] = useState("hb-cookies.com");
  const [email, setEmail] = useState("info@hb-cookies.com");
  const [instagram, setInstagram] = useState("@honey_bunny_canada");
  const [note, setNote] = useState("‘not for resale’");

  /* --- ВЕС / ПРЕСЕТЫ --- */
  const [weightPreset, setWeightPreset] = useState("45");
  const [weight, setWeight] = useState("45g");
  const [tolerance, setTolerance] = useState("+/-5g");
  const [origin, setOrigin] = useState("Made in CANADA");

  /* --- ЛОГОТИП / QR --- */
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const [logoSizeMM, setLogoSizeMM] = useState(22);

// --- ДОП. ЗНАЧОК (иконка "Nut free", vegan и т.п.) ---
  const [badgeUrl, setBadgeUrl] = useState(DOP_LOGO_URL);
  const [badgeSizeMM, setBadgeSizeMM] = useState(22);

  /* --- РАСКЛАДКА / КАЛИБРОВКА --- */
  const [count, setCount] = useState(15);
  const [cols, setCols] = useState(3);
  const [labelWidthMM, setLabelWidthMM] = useState(50);
  const [labelHeightMM, setLabelHeightMM] = useState(66);

  const [topOffsetMM, setTopOffsetMM] = useState(5);
  const [leftOffsetMM, setLeftOffsetMM] = useState(5);
  const [horizontalGapMM, setHorizontalGapMM] = useState(2);
  const [verticalGapMM, setVerticalGapMM] = useState(2);

  /* --- ПРОФИЛИ --- */
  const [profiles, setProfiles] = useState([]); // [{id, name, config}]
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  /* ==========================
     ПРОИЗВОДНЫЕ ЗНАЧЕНИЯ
     ========================== */

  const mfgDateObj = useMemo(() => {
    const d = new Date(mfgDate);
    return isNaN(d.getTime()) ? null : d;
  }, [mfgDate]);

  const bestBeforeDate = useMemo(() => {
    if (!mfgDateObj) return null;
    const ms = shelfLifeDays * 24 * 60 * 60 * 1000;
    const out = new Date(mfgDateObj.getTime() + ms);
    return isNaN(out.getTime()) ? null : out;
  }, [mfgDateObj, shelfLifeDays]);

  const mfgDateFormatted = useMemo(
    () => formatDate(mfgDateObj, dateFormat),
    [mfgDateObj, dateFormat]
  );
  const bestBeforeFormatted = useMemo(
    () => formatDate(bestBeforeDate, dateFormat),
    [bestBeforeDate, dateFormat]
  );

  const expirationLine = useMemo(
    () => `Expiration date: ${shelfLifeDays} days`,
    [shelfLifeDays]
  );
  const bestBeforeLine = useMemo(
    () => `Best Before: ${bestBeforeFormatted}`,
    [bestBeforeFormatted]
  );

  const labels = useMemo(
    () => Array.from({ length: Math.max(1, Number(count) || 1) }),
    [count]
  );

  /* ==========================
     LOCALSTORAGE: ЗАГРУЗКА
     ========================== */

  useEffect(() => {
    try {
      // последний использованный конфиг
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);

        if (data.brand) setBrand(data.brand);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.ingredients) setIngredients(data.ingredients);
        if (data.calories) setCalories(data.calories);
        if (data.storage) setStorage(data.storage);

        if ("badgeUrl" in data) setBadgeUrl(data.badgeUrl);
        if (typeof data.badgeSizeMM === "number") setBadgeSizeMM(data.badgeSizeMM);

        if (data.mfgDate) setMfgDate(data.mfgDate);
        if (typeof data.shelfLifeDays === "number")
          setShelfLifeDays(data.shelfLifeDays);
        if (data.dateFormat) setDateFormat(data.dateFormat);

        if (data.website) setWebsite(data.website);
        if (data.email) setEmail(data.email);
        if (data.instagram) setInstagram(data.instagram);
        if ("note" in data) setNote(data.note); // допускаем и пустую строку

        if (data.weightPreset) setWeightPreset(data.weightPreset);
        if (data.weight) setWeight(data.weight);
        if (data.tolerance) setTolerance(data.tolerance);
        if (data.origin) setOrigin(data.origin);

        if (typeof data.logoSizeMM === "number")
          setLogoSizeMM(data.logoSizeMM);

        if (typeof data.count === "number") setCount(data.count);
        if (typeof data.cols === "number") setCols(data.cols);
        if (typeof data.labelWidthMM === "number")
          setLabelWidthMM(data.labelWidthMM);
        if (typeof data.labelHeightMM === "number")
          setLabelHeightMM(data.labelHeightMM);

        if (typeof data.topOffsetMM === "number")
          setTopOffsetMM(data.topOffsetMM);
        if (typeof data.leftOffsetMM === "number")
          setLeftOffsetMM(data.leftOffsetMM);
        if (typeof data.horizontalGapMM === "number")
          setHorizontalGapMM(data.horizontalGapMM);
        if (typeof data.verticalGapMM === "number")
          setVerticalGapMM(data.verticalGapMM);
      }

      // профили
      const rawProfiles = localStorage.getItem(PROFILES_KEY);
      if (rawProfiles) {
        const arr = JSON.parse(rawProfiles);
        if (Array.isArray(arr)) {
          setProfiles(arr);
          if (arr[0]) {
            setSelectedProfileId(arr[0].id);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load config", e);
    }
  }, []);

  /* ==========================
     LOCALSTORAGE: СОХРАНЕНИЕ
     ========================== */

  useEffect(() => {
    const payload = buildConfigFromState({
      brand,
      subtitle,
      ingredients,
      calories,
      storage,
      mfgDate,
      shelfLifeDays,
      dateFormat,
      website,
      email,
      instagram,
      note,
      weightPreset,
      weight,
      tolerance,
      origin,
      logoSizeMM,
      count,
      cols,
      labelWidthMM,
      labelHeightMM,
      topOffsetMM,
      leftOffsetMM,
      horizontalGapMM,
      verticalGapMM,
      badgeUrl,
      badgeSizeMM,
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to save config", e);
    }
  }, [
    brand,
    subtitle,
    ingredients,
    calories,
    storage,
    mfgDate,
    shelfLifeDays,
    dateFormat,
    website,
    email,
    instagram,
    note,
    weightPreset,
    weight,
    tolerance,
    origin,
    logoSizeMM,
    count,
    cols,
    labelWidthMM,
    labelHeightMM,
    topOffsetMM,
    leftOffsetMM,
    horizontalGapMM,
    verticalGapMM,
    badgeUrl,
    badgeSizeMM,
  ]);

  /* ==========================
     ЛОГИКА ПРОФИЛЕЙ
     ========================== */

  const saveProfilesToStorage = (next) => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to save profiles", e);
    }
  };

  const handleSaveAsNewProfile = () => {
    const name = window.prompt(
      "Название профиля (например: 15 шт 50x66 / 18 шт 39x64):"
    );
    if (!name) return;

    const config = buildConfigFromState({
      brand,
      subtitle,
      ingredients,
      calories,
      storage,
      mfgDate,
      shelfLifeDays,
      dateFormat,
      website,
      email,
      instagram,
      note,
      weightPreset,
      weight,
      tolerance,
      origin,
      logoSizeMM,
      count,
      cols,
      labelWidthMM,
      labelHeightMM,
      topOffsetMM,
      leftOffsetMM,
      horizontalGapMM,
      verticalGapMM,
      badgeUrl,
      badgeSizeMM,
    });

    const newProfile = {
      id: Date.now().toString(),
      name,
      config,
    };

    const next = [...profiles, newProfile];
    setProfiles(next);
    setSelectedProfileId(newProfile.id);
    saveProfilesToStorage(next);
  };

  const handleApplyProfile = (id) => {
    setSelectedProfileId(id);
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    const cfg = profile.config || {};

    if (cfg.brand) setBrand(cfg.brand);
    if (cfg.subtitle) setSubtitle(cfg.subtitle);
    if (cfg.ingredients) setIngredients(cfg.ingredients);
    if (cfg.calories) setCalories(cfg.calories);
    if (cfg.storage) setStorage(cfg.storage);

    if (cfg.mfgDate) setMfgDate(cfg.mfgDate);
    if (typeof cfg.shelfLifeDays === "number")
      setShelfLifeDays(cfg.shelfLifeDays);
    if (cfg.dateFormat) setDateFormat(cfg.dateFormat);

    if (cfg.website) setWebsite(cfg.website);
    if (cfg.email) setEmail(cfg.email);
    if (cfg.instagram) setInstagram(cfg.instagram);
    if ("note" in cfg) setNote(cfg.note);

    if (cfg.weightPreset) setWeightPreset(cfg.weightPreset);
    if (cfg.weight) setWeight(cfg.weight);
    if (cfg.tolerance) setTolerance(cfg.tolerance);
    if (cfg.origin) setOrigin(cfg.origin);

    if (cfg.badgeUrl) setBadgeUrl(cfg.badgeUrl);
    if (typeof cfg.badgeSizeMM === "number") setBadgeSizeMM(cfg.badgeSizeMM);

    if (typeof cfg.logoSizeMM === "number") setLogoSizeMM(cfg.logoSizeMM);

    if (typeof cfg.count === "number") setCount(cfg.count);
    if (typeof cfg.cols === "number") setCols(cfg.cols);
    if (typeof cfg.labelWidthMM === "number")
      setLabelWidthMM(cfg.labelWidthMM);
    if (typeof cfg.labelHeightMM === "number")
      setLabelHeightMM(cfg.labelHeightMM);
    if (typeof cfg.topOffsetMM === "number") setTopOffsetMM(cfg.topOffsetMM);
    if (typeof cfg.leftOffsetMM === "number") setLeftOffsetMM(cfg.leftOffsetMM);
    if (typeof cfg.horizontalGapMM === "number")
      setHorizontalGapMM(cfg.horizontalGapMM);
    if (typeof cfg.verticalGapMM === "number")
      setVerticalGapMM(cfg.verticalGapMM);
  };

  const handleUpdateCurrentProfile = () => {
    if (!selectedProfileId) return;
    const idx = profiles.findIndex((p) => p.id === selectedProfileId);
    if (idx === -1) return;

    const config = buildConfigFromState({
      brand,
      subtitle,
      ingredients,
      calories,
      storage,
      mfgDate,
      shelfLifeDays,
      dateFormat,
      website,
      email,
      instagram,
      note,
      weightPreset,
      weight,
      tolerance,
      origin,
      logoSizeMM,
      count,
      cols,
      labelWidthMM,
      labelHeightMM,
      topOffsetMM,
      leftOffsetMM,
      horizontalGapMM,
      verticalGapMM,
      badgeUrl,
      badgeSizeMM,
    });

    const next = [...profiles];
    next[idx] = { ...next[idx], config };
    setProfiles(next);
    saveProfilesToStorage(next);
  };

  const handleDeleteProfile = () => {
    if (!selectedProfileId) return;
    if (!window.confirm("Точно удалить этот профиль?")) return;

    const next = profiles.filter((p) => p.id !== selectedProfileId);
    setProfiles(next);
    saveProfilesToStorage(next);
    setSelectedProfileId(next[0]?.id || null);
  };

  /* ==========================
     ПРОЧИЕ ХЕНДЛЕРЫ
     ========================== */

  const handleWeightPresetChange = (id) => {
    setWeightPreset(id);
    const preset = WEIGHT_PRESETS.find((p) => p.id === id);
    if (!preset || id === "custom") return;

    if (preset.weight) setWeight(preset.weight);
    if (preset.tolerance) setTolerance(preset.tolerance);
    if (preset.calories) setCalories(preset.calories);
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    // профили НЕ трогаем, чтобы не потерять настройки листов
    window.location.reload();
  };

  /* ==========================
     РЕНДЕР
     ========================== */

  return (
    <div className="label-page">
      {/* Верхний блок: заголовок + кнопки */}
      <div className="label-header print-hide">
        <div>
          <h1 className="label-title">HB Cookies — генератор этикеток</h1>
          <p className="label-subtitle">
            Один источник правды: меняете поле в форме — оно применяется ко
            всем этикеткам.
          </p>
        </div>

        <div className="label-header-buttons">
          <button className="btn btn-primary" onClick={handlePrint}>
            Печать
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            Сбросить по умолчанию
          </button>
        </div>
      </div>

      {/* Левая колонка — панель, правая — предпросмотр */}
      <div className="label-layout">
        <div className="label-controls print-hide">
          {/* Профили */}
          <Panel title="Шаблоны листов (профили)">
            <div className="field">
              <div className="field-label">Выбрать профиль</div>
              <select
                className="field-input"
                value={selectedProfileId || ""}
                onChange={(e) => handleApplyProfile(e.target.value)}
              >
                <option value="">– не выбран –</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="adjust-row">
              <button
                type="button"
                className="btn btn-small"
                onClick={handleSaveAsNewProfile}
              >
                Сохранить как новый
              </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={handleUpdateCurrentProfile}
                disabled={!selectedProfileId}
              >
                Обновить выбранный
              </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={handleDeleteProfile}
                disabled={!selectedProfileId}
              >
                Удалить
              </button>
            </div>
          </Panel>

          {/* Основные данные */}
          <Panel title="Основные данные">
            <LabeledInput
              label="Бренд / Название"
              value={brand}
              onChange={setBrand}
            />
            <LabeledInput
              label="Подзаголовок"
              value={subtitle}
              onChange={setSubtitle}
            />
            <LabeledTextarea
              label="Ингредиенты"
              value={ingredients}
              onChange={setIngredients}
            />
          </Panel>

          {/* Даты */}
          <Panel title="Даты и срок годности">
            <LabeledInput
              type="date"
              label="Дата изготовления (исходная)"
              value={mfgDate}
              onChange={setMfgDate}
            />
            <LabeledInput
              type="number"
              label="Срок годности, дней"
              value={String(shelfLifeDays)}
              onChange={(v) => setShelfLifeDays(Number(v) || 0)}
            />

            <div className="field">
              <div className="field-label">Формат даты</div>
              <select
                className="field-input"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="us">MM/DD/YYYY (US)</option>
                <option value="eu">DD.MM.YYYY (EU)</option>
                <option value="iso">YYYY-MM-DD (ISO)</option>
              </select>
            </div>

            <ReadOnlyField
              label="Дата изготовления (на этикетке)"
              value={mfgDateFormatted}
            />
            <ReadOnlyField label="Expiration" value={expirationLine} />
            <ReadOnlyField label="Best Before" value={bestBeforeLine} />
          </Panel>

          {/* Контакты */}
          <Panel title="Контакты и пометки">
            <LabeledInput
              label="Website"
              value={website}
              onChange={setWebsite}
            />
            <LabeledInput label="Mail" value={email} onChange={setEmail} />
            <LabeledInput
              label="Instagram"
              value={instagram}
              onChange={setInstagram}
            />
            <LabeledInput label="Примечание" value={note} onChange={setNote} />
          </Panel>

          {/* Вес и происхождение */}
          <Panel title="Вес, происхождение и пресеты">
            <div className="field">
              <div className="field-label">Пресет по весу</div>
              <select
                className="field-input"
                value={weightPreset}
                onChange={(e) => handleWeightPresetChange(e.target.value)}
              >
                {WEIGHT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <LabeledInput label="Вес" value={weight} onChange={setWeight} />
            <LabeledInput
              label="Допуск веса"
              value={tolerance}
              onChange={setTolerance}
            />
            <LabeledInput
              label="Калорийность"
              value={calories}
              onChange={setCalories}
            />
            <LabeledInput
              label="Страна / происхождение"
              value={origin}
              onChange={setOrigin}
            />
          </Panel>

          {/* Логотип / QR */}
          <Panel title="Логотип / QR">
            <LabeledInput
              label="URL логотипа / QR"
              value={logoUrl}
              onChange={setLogoUrl}
            />
            <AdjustInput
              label="Размер логотипа, мм"
              value={logoSizeMM}
              onChange={setLogoSizeMM}
              step={1}
              min={8}
            />
            <div className="hint">
              По умолчанию используется файл{" "}
              <code>public/qr-code.png</code>. Можно заменить URL на любой
              другой.
            </div>
          </Panel>

          <Panel title="Доп. значок (иконка в центре)">
            <LabeledInput
              label="URL значка"
              value={badgeUrl}
              onChange={setBadgeUrl}
            />
            <AdjustInput
              label="Размер значка, мм"
              value={badgeSizeMM}
              onChange={setBadgeSizeMM}
              step={1}
              min={8}
            />
            <div className="hint">
              Сюда можно указать, например, иконку <code>NutsFREE.png</code>, vegan и т.п.
            </div>
          </Panel>

          {/* Раскладка / калибровка */}
          <Panel title="Печать, раскладка и калибровка">
            <LabeledInput
              type="number"
              label="Количество этикеток"
              value={String(count)}
              onChange={setCount}
            />
            <LabeledInput
              type="number"
              label="Колонок на странице"
              value={String(cols)}
              onChange={(v) => setCols(Math.max(1, Number(v) || 1))}
            />

            <div className="field-row">
              <LabeledInput
                type="number"
                label="Ширина этикетки, мм"
                value={String(labelWidthMM)}
                onChange={(v) =>
                  setLabelWidthMM(Math.max(20, Number(v) || 20))
                }
              />
              <LabeledInput
                type="number"
                label="Высота этикетки, мм"
                value={String(labelHeightMM)}
                onChange={(v) =>
                  setLabelHeightMM(Math.max(20, Number(v) || 20))
                }
              />
            </div>

            <AdjustInput
              label="Отступ сверху, мм"
              value={topOffsetMM}
              onChange={setTopOffsetMM}
              step={0.2}
              min={0}
            />
            <AdjustInput
              label="Отступ слева, мм"
              value={leftOffsetMM}
              onChange={setLeftOffsetMM}
              step={0.2}
              min={0}
            />
            <AdjustInput
              label="Расстояние между колонками, мм"
              value={horizontalGapMM}
              onChange={setHorizontalGapMM}
              step={0.2}
              min={0}
            />
            <AdjustInput
              label="Расстояние между рядами, мм"
              value={verticalGapMM}
              onChange={setVerticalGapMM}
              step={0.2}
              min={0}
            />

            <div className="hint">
              Для калибровки распечатай пустые рамки и подгони отступы под лист
              наклеек.
            </div>
          </Panel>
        </div>

        {/* ПРЕДПРОСМОТР / ПЕЧАТЬ */}
        <div className="label-preview">
          <div className="label-sheet">
            <div
              className="label-grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, auto)`,
                paddingTop: `${topOffsetMM}mm`,
                paddingLeft: `${leftOffsetMM}mm`,
                columnGap: `${horizontalGapMM}mm`,
                rowGap: `${verticalGapMM}mm`,
              }}
            >
              {labels.map((_, i) => (
                <LabelCard
                  key={i}
                  brand={brand}
                  subtitle={subtitle}
                  ingredients={ingredients}
                  calories={calories}
                  storage={storage}
                  expirationLine={expirationLine}
                  bestBeforeLine={bestBeforeLine}
                  website={website}
                  email={email}
                  instagram={instagram}
                  note={note}
                  weight={weight}
                  tolerance={tolerance}
                  origin={origin}
                  mfgDateFormatted={mfgDateFormatted}
                  logoUrl={logoUrl || DEFAULT_LOGO_URL}
                  logoSizeMM={logoSizeMM}
                  widthMM={labelWidthMM}
                  heightMM={labelHeightMM}
                  badgeUrl={badgeUrl}
                  badgeSizeMM={badgeSizeMM}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================
   ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
   ========================== */

function Panel({ title, children }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <input
        type={type}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function LabeledTextarea({ label, value, onChange }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <textarea
        className="field-input textarea"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-readonly">{value}</div>
    </div>
  );
}

function AdjustInput({ label, value, onChange, step = 0.5, min = 0 }) {
  const num = Number(value) || 0;

  const update = (next) => {
    const v = Math.max(min, Number(next));
    onChange(v);
  };

  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="adjust-row">
        <button
          type="button"
          className="btn btn-small"
          onClick={() => update(num - step)}
        >
          -
        </button>
        <input
          type="number"
          className="field-input"
          value={String(num)}
          onChange={(e) => update(e.target.value)}
          step={step}
        />
        <button
          type="button"
          className="btn btn-small"
          onClick={() => update(num + step)}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* карточка этикетки */

function LabelCard({
  brand,
  subtitle,
  ingredients,
  calories,
  storage,
  expirationLine,
  bestBeforeLine,
  website,
  email,
  instagram,
  note,
  weight,
  tolerance,
  origin,
  mfgDateFormatted,
  logoUrl,
  logoSizeMM,
  widthMM,
  heightMM,
  badgeUrl,
  badgeSizeMM,
}) {
  return (
    <div
      className="hb-label-card"
      style={{ width: `${widthMM}mm`, height: `${heightMM}mm` }}
    >
      {/* верх */}
      <div className="hb-label-header">
        <div className="hb-label-brand">{brand}</div>
        <div className="hb-label-subtitle">{subtitle}</div>
      </div>

      {/* тело */}
      <div className="hb-label-body">
        <div className="hb-label-body-left">
          <div className="hb-label-ingredients">{ingredients}</div>

          <div className="hb-label-calories">
            {calories}
            <br />
            {storage}
          </div>

          <div className="hb-label-dates">
            {`Expiration date: ${shelfLifeDaysFromLine(expirationLine)}`}
            <br />
            {bestBeforeLine}
            <br />
            {`Mfg date: ${mfgDateFormatted}`}
          </div>

          <div className="hb-label-contacts">
            {`Website: ${website}`}
            <br />
            {`Mail: ${email}`}
          </div>
        </div>

        {badgeUrl && (
          <div className="hb-label-body-center">
            <div
              className="hb-label-badge"
              style={{
                width: `${badgeSizeMM}mm`,
                height: `${badgeSizeMM}mm`,
              }}
            >
              <img src={badgeUrl} alt="Badge" />
            </div>
          </div>
        )}

        <div className="hb-label-body-right">
          {logoUrl && (
            <div
              className="hb-label-qr"
              style={{
                width: `${logoSizeMM}mm`,
                height: `${logoSizeMM}mm`,
              }}
            >
              <img src={logoUrl} alt="QR" />
            </div>
          )}

          <div className="hb-label-weight">
            <div className="hb-label-weight-main">{weight}</div>
            <div className="hb-label-weight-tolerance">{tolerance}</div>
          </div>
        </div>
      </div>

      {/* низ */}
      <div className="hb-label-footer">
        {instagram && <div>{instagram}</div>}
        <div>{origin}</div>
        {note && <div className="hb-label-note">{note}</div>}
      </div>
    </div>
  );
}

function shelfLifeDaysFromLine(line) {
  const m = String(line).match(/(\d+)\s*days/);
  return m ? `${m[1]} days` : line;
}
