const fs = require('fs');
const path = require('path');

const KEYWORDS = {
  'CPU': [
    'Processor', 'Core i3', 'Core i5', 'Core i7', 'Core i9',
    'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9',
    'Celeron', 'Pentium', 'Atom', 'Threadripper',
    ' LGA', 'AM4', 'AM5', '1700', '1200'
  ],
  'CPU Cooler': [
    'Cooler', 'AIO', 'Liquid Cooler', 'Air Cooler', 'Cooling',
    'Kraken', 'MasterLiquid', 'MasterAir', 'Dark Rock',
    'NH-D15', 'Noctua', 'be quiet', 'ID-COOLING',
    'CPU Cooler', 'Fan', 'Radiator', 'Thermal', 'Wraith', 'FUMA'
  ],
  'GPU': [
    'Graphics Card', 'GeForce', 'GTX', 'RTX', 'Radeon',
    'RX ', 'Arc ', 'RX Vega', 'RX 5000', 'RX 6000', 'RX 7000',
    'RTX 3000', 'RTX 4000', 'RTX 5000',
    'RX 7600', 'RX 7700', 'RX 7800', 'RX 7900',
    'RTX 3060', 'RTX 3070', 'RTX 3080', 'RTX 3090',
    'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090',
    'RTX 5070', 'RTX 5080', 'RTX 5090'
  ],
  'Motherboard': [
    'Motherboard', 'Mobo', 'Mainboard',
    'ROG ', 'PRIME', 'AORUS', 'GIGABYTE', 'MSI',
    'TUF Gaming', 'STRIX', 'MAG ', 'MEG ',
    'B550', 'B650', 'B660', 'B760', 'Z690', 'Z790',
    'X570', 'X670', 'X299', 'TR4', 'sTR4'
  ],
  'RAM': [
    'DDR4', 'DDR5', 'Memory', 'RAM ', 'RAM-',
    'GB RAM', 'Memory Kit', 'DIMM', 'UDIMM',
    'Corsair Vengeance', 'G.Skill Trident', 'Kingston Fury',
    'TeamGroup', 'Crucial', 'Patriot'
  ],
  'SSD': [
    'SSD', 'NVMe', 'M.2 SSD', 'SATA SSD', 'Solid State',
    'Samsung 980', 'Samsung 990', 'WD SN', 'Crucial P',
    'Kingston A', 'Kingston KC', 'TeamGroup MP'
  ],
  'PSU': [
    'Power Supply', 'PSU', ' Watt', 'W PSU',
    '80+', '80 PLUS', 'Gold', 'Platinum', 'Bronze',
    'Corsair RM', 'EVGA G', 'Seasonic', 'be quiet!',
    '750W', '850W', '1000W', '1200W', '650W'
  ],
  'PC Case': [
    'Case', 'Chassis', 'Cabinet', 'Tower',
    'NZXT ', 'Corsair ', 'Phanteks', 'Cooler Master',
    'Fractal', 'Lian Li', 'Thermaltake',
    'Mid Tower', 'Full Tower', 'Mini ITX'
  ]
};

function getCategoryFromKeyword(productName) {
  if (!productName) return 'Uncategorized';
  
  const nameLower = productName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'Uncategorized';
}

function processCSV() {
  const baseDir = path.join(__dirname, '..');
  const inputPath = path.join(baseDir, 'supabase tables', 'Product_Catalog_rows.csv');
  const outputPath = path.join(baseDir, 'supabase tables', 'Product_Catalog_cleaned.csv');
  const reportPath = path.join(baseDir, 'supabase tables', 'cleaning_report.txt');
  
  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const report = {
    total: 0,
    unchanged: 0,
    corrected: 0,
    uncategorized: 0,
    corrections: []
  };
  
  const outputLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === 0) {
      outputLines.push(line);
      continue;
    }
    
    if (!line.trim()) {
      outputLines.push(line);
      continue;
    }
    
    report.total++;
    
    const firstCommaIndex = line.indexOf(',');
    if (firstCommaIndex === -1) {
      outputLines.push(line);
      continue;
    }
    
    const originalCategory = line.substring(0, firstCommaIndex);
    const restOfLine = line.substring(firstCommaIndex + 1);
    
    let productName = '';
    let inQuotes = false;
    let charIndex = 0;
    
    for (let j = 0; j < restOfLine.length; j++) {
      const char = restOfLine[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        productName = restOfLine.substring(0, j);
        break;
      }
    }
    
    if (!productName) {
      productName = restOfLine;
    }
    
    const newCategory = getCategoryFromKeyword(productName);
    
    if (newCategory === 'Uncategorized') {
      report.uncategorized++;
      if (originalCategory !== 'Uncategorized') {
        report.corrected++;
        report.corrections.push(`${originalCategory} → Uncategorized`);
      } else {
        report.unchanged++;
      }
      outputLines.push('Uncategorized,' + restOfLine);
    } else if (newCategory !== originalCategory) {
      report.corrected++;
      report.corrections.push(`${originalCategory} → ${newCategory}`);
      outputLines.push(newCategory + ',' + restOfLine);
    } else {
      report.unchanged++;
      outputLines.push(line);
    }
  }
  
  fs.writeFileSync(outputPath, outputLines.join('\n'));
  
  const correctionCounts = {};
  report.corrections.forEach(c => {
    correctionCounts[c] = (correctionCounts[c] || 0) + 1;
  });
  
  let reportText = '=== PRODUCT CLEANING REPORT ===\n\n';
  reportText += `Total Products: ${report.total}\n`;
  reportText += `Unchanged: ${report.unchanged}\n`;
  reportText += `Corrected: ${report.corrected}\n`;
  reportText += `Uncategorized: ${report.uncategorized}\n\n`;
  
  reportText += '=== CORRECTIONS MADE ===\n';
  Object.entries(correctionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([key, count]) => {
      reportText += `  ${key}: ${count}\n`;
    });
  
  fs.writeFileSync(reportPath, reportText);
  
  console.log('=== CLEANING COMPLETE ===');
  console.log(`Total: ${report.total}`);
  console.log(`Unchanged: ${report.unchanged}`);
  console.log(`Corrected: ${report.corrected}`);
  console.log(`Uncategorized: ${report.uncategorized}`);
  console.log(`\nCleaned CSV saved to: ${outputPath}`);
  console.log(`Report saved to: ${reportPath}`);
}

processCSV();