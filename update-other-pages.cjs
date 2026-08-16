const fs = require('fs');

function updateStore() {
    let store = fs.readFileSync('src/pages/AgroStore.tsx', 'utf8');
    if (!store.includes('useLanguage')) {
        store = store.replace("import { useCart } from '../contexts/CartContext';", "import { useCart } from '../contexts/CartContext';\nimport { useLanguage } from '../contexts/LanguageContext';");
    }
    if (!store.includes('const { t } = useLanguage();')) {
        store = store.replace("export function AgroStore() {", "export function AgroStore() {\n  const { t } = useLanguage();");
    }
    
    store = store.replace(/>Highest Rated</g, ">{t('store.sort.popular')}<");
    store = store.replace(/>Price: Low to High</g, ">{t('store.sort.priceLow')}<");
    store = store.replace(/>Price: High to Low</g, ">{t('store.sort.priceHigh')}<");
    store = store.replace(/>In Stock</g, ">{t('store.inStock')}<");
    store = store.replace(/>Add to Cart</g, ">{t('store.addToCart')}<");
    fs.writeFileSync('src/pages/AgroStore.tsx', store);
}

function updateAnalytics() {
    let analytics = fs.readFileSync('src/pages/AnalyticsDashboard.tsx', 'utf8');
    if (!analytics.includes('useLanguage')) {
        analytics = analytics.replace("import { cn } from '@/src/lib/utils';", "import { cn } from '@/src/lib/utils';\nimport { useLanguage } from '../contexts/LanguageContext';");
    }
    if (!analytics.includes('const { t } = useLanguage();')) {
        analytics = analytics.replace("export function AnalyticsDashboard() {", "export function AnalyticsDashboard() {\n  const { t } = useLanguage();");
    }
    
    analytics = analytics.replace(/"Revenue vs Expenses \(YTD\)"/g, "t('analytics.revenue')");
    analytics = analytics.replace(/"Yield Prediction \(tons\)"/g, "t('analytics.yield')");
    analytics = analytics.replace(/"Market Prices"/g, "t('analytics.market')");
    analytics = analytics.replace(/"Today's Tasks"/g, "t('analytics.tasks')");
    fs.writeFileSync('src/pages/AnalyticsDashboard.tsx', analytics);
}

function updateWeather() {
    let weather = fs.readFileSync('src/pages/WeatherDashboard.tsx', 'utf8');
    if (!weather.includes('useLanguage')) {
        weather = weather.replace("import { cn } from '@/src/lib/utils';", "import { cn } from '@/src/lib/utils';\nimport { useLanguage } from '../contexts/LanguageContext';");
    }
    if (!weather.includes('const { t } = useLanguage();')) {
        weather = weather.replace("export function WeatherDashboard() {", "export function WeatherDashboard() {\n  const { t } = useLanguage();");
    }
    
    weather = weather.replace(/"Current Weather"/g, "t('weather.current')");
    weather = weather.replace(/"7-Day Forecast"/g, "t('weather.forecast')");
    weather = weather.replace(/"Wind Speed"/g, "t('weather.wind')");
    weather = weather.replace(/"Humidity"/g, "t('weather.humidity')");
    fs.writeFileSync('src/pages/WeatherDashboard.tsx', weather);
}

function updateScan() {
    let scan = fs.readFileSync('src/pages/DiseaseScan.tsx', 'utf8');
    // already has useLanguage
    scan = scan.replace(/"Upload an image of your crop"/g, "t('scan.upload')");
    scan = scan.replace(/"Use Camera"/g, "t('scan.camera')");
    scan = scan.replace(/"Analyzing disease..."/g, "t('scan.analyzing')");
    fs.writeFileSync('src/pages/DiseaseScan.tsx', scan);
}

updateStore();
updateAnalytics();
updateWeather();
updateScan();

console.log('Other pages updated');
