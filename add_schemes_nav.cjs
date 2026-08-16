const fs = require('fs');
let sb = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!sb.includes('nav.schemes')) {
  sb = sb.replace("import { MessageSquare, LayoutDashboard, Store, Sprout, Settings, Plus, Leaf, Search, LogOut, Package, Bug, CloudRain, Box, BarChart } from 'lucide-react';", 
                  "import { MessageSquare, LayoutDashboard, Store, Sprout, Settings, Plus, Leaf, Search, LogOut, Package, Bug, CloudRain, Box, BarChart, Landmark } from 'lucide-react';");
  
  sb = sb.replace("{ icon: BarChart, label: t('nav.analytics'), path: \"/analytics\" },", 
                  "{ icon: BarChart, label: t('nav.analytics'), path: \"/analytics\" },\n    { icon: Landmark, label: t('nav.schemes'), path: \"/schemes\" },");
  
  fs.writeFileSync('src/components/Sidebar.tsx', sb);
  console.log('Sidebar updated');
}

let lc = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
if (!lc.includes("'nav.schemes'")) {
  lc = lc.replace("'nav.analytics': 'Analytics',", "'nav.analytics': 'Analytics',\n    'nav.schemes': 'Gov Schemes',");
  lc = lc.replace("'nav.analytics': 'विश्लेषण',", "'nav.analytics': 'विश्लेषण',\n    'nav.schemes': 'सरकारी योजनाएं',");
  // using regex for marathi since there are multiple
  lc = lc.replace(/'nav.analytics': 'विश्लेषण',/g, "'nav.analytics': 'विश्लेषण',\n    'nav.schemes': 'सरकारी योजना',");
  
  // Cleanup any duplicates if regex ran twice
  fs.writeFileSync('src/contexts/LanguageContext.tsx', lc);
  console.log('LanguageContext updated');
}

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('GovSchemes')) {
  app = app.replace("import { Analytics } from './pages/Analytics';", "import { Analytics } from './pages/Analytics';\nimport { GovSchemes } from './pages/GovSchemes';");
  app = app.replace("<Route path=\"/analytics\" element={<Analytics />} />", "<Route path=\"/analytics\" element={<Analytics />} />\n            <Route path=\"/schemes\" element={<GovSchemes />} />");
  fs.writeFileSync('src/App.tsx', app);
  console.log('App routing updated');
}

