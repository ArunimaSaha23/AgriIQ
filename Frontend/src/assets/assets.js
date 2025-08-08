 import grass from './grass.png';

 export const allCropReports = [
    {
      id: 1,
      crop: 'Tomato',
      issue: 'Early Blight',
      confidence: '92%',
      category: 'Fungal Disease',
      symptoms: 'Brown concentric spots, yellowing of older leaves',
      action: 'Apply a fungicide containing chlorothalonil. Ensure proper plant spacing for airflow.',
      treatment: [
        'Apply a fungicide containing chlorothalonil or mancozeb',
        'Remove and destroy infected leaves'
      ],
      prevention: [
        'Rotate crops annually',
        'Ensure proper spacing and ventilation'
      ],
      date: '25, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 2,
      crop: 'Wheat',
      issue: 'Rust Disease',
      confidence: '88%',
      category: 'Fungal Disease',
      symptoms: 'Orange-red pustules on leaves and stems',
      action: 'Apply triazole-based fungicide. Remove infected plant debris and improve field drainage.',
      treatment: [
        'Apply triazole-based fungicide (propiconazole)',
        'Remove infected plant debris immediately'
      ],
      prevention: [
        'Use resistant wheat varieties',
        'Improve field drainage and air circulation'
      ],
      date: '20, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 3,
      crop: 'Corn',
      issue: 'Northern Corn Leaf Blight',
      confidence: '85%',
      category: 'Fungal Disease',
      symptoms: 'Large, grayish-green lesions with dark borders',
      action: 'Use resistant varieties and apply foliar fungicides during early disease development.',
      treatment: [
        'Apply foliar fungicides (strobilurin-based)',
        'Remove infected plant residue'
      ],
      prevention: [
        'Plant resistant corn varieties',
        'Practice crop rotation with non-host plants'
      ],
      date: '18, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 4,
      crop: 'Potato',
      issue: 'Late Blight',
      confidence: '94%',
      category: 'Fungal Disease',
      symptoms: 'Water-soaked lesions with white fuzzy growth',
      action: 'Apply copper-based fungicide immediately. Destroy infected plants and improve ventilation.',
      treatment: [
        'Apply copper-based fungicide immediately',
        'Destroy infected plants completely'
      ],
      prevention: [
        'Improve ventilation between plants',
        'Avoid overhead watering'
      ],
      date: '15, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 5,
      crop: 'Rice',
      issue: 'Blast Disease',
      confidence: '90%',
      category: 'Fungal Disease',
      symptoms: 'Diamond-shaped lesions with gray centers',
      action: 'Apply tricyclazole fungicide and maintain proper water management in fields.',
      treatment: [
        'Apply tricyclazole fungicide',
        'Maintain proper water management'
      ],
      prevention: [
        'Use blast-resistant rice varieties',
        'Avoid excessive nitrogen fertilization'
      ],
      date: '12, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 6,
      crop: 'Tomato',
      issue: 'Bacterial Wilt',
      confidence: '87%',
      category: 'Bacterial Disease',
      symptoms: 'Sudden wilting of entire plant, brown vascular tissue',
      action: 'Remove infected plants immediately. Use resistant varieties and practice crop rotation.',
      treatment: [
        'Remove infected plants immediately',
        'Apply copper-based bactericide'
      ],
      prevention: [
        'Use resistant tomato varieties',
        'Practice crop rotation with non-solanaceous crops'
      ],
      date: '10, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Stem',
      image: grass
    },
    {
      id: 7,
      crop: 'Cucumber',
      issue: 'Powdery Mildew',
      confidence: '91%',
      category: 'Fungal Disease',
      symptoms: 'White powdery coating on leaves and stems',
      action: 'Apply sulfur-based fungicide. Increase air circulation and reduce humidity levels.',
      treatment: [
        'Apply sulfur-based fungicide',
        'Increase air circulation around plants'
      ],
      prevention: [
        'Reduce humidity levels in growing area',
        'Avoid overhead watering'
      ],
      date: '8, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 8,
      crop: 'Bell Pepper',
      issue: 'Anthracnose',
      confidence: '89%',
      category: 'Fungal Disease',
      symptoms: 'Circular, sunken lesions with dark centers',
      action: 'Apply copper fungicide and ensure proper drainage. Avoid overhead watering.',
      treatment: [
        'Apply copper fungicide regularly',
        'Remove infected fruits and plant debris'
      ],
      prevention: [
        'Ensure proper drainage',
        'Avoid overhead watering methods'
      ],
      date: '5, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Fruit',
      image: grass
    },
    {
      id: 9,
      crop: 'Wheat',
      issue: 'Powdery Mildew',
      confidence: '93%',
      category: 'Fungal Disease',
      symptoms: 'White fluffy growth on leaves and stems',
      action: 'Use resistant cultivars and apply propiconazole-based fungicide at early growth stages.',
      treatment: [
        'Apply propiconazole-based fungicide',
        'Remove heavily infected plant parts'
      ],
      prevention: [
        'Use resistant wheat cultivars',
        'Maintain proper plant spacing'
      ],
      date: '3, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    },
    {
      id: 10,
      crop: 'Soybean',
      issue: 'Frogeye Leaf Spot',
      confidence: '86%',
      category: 'Fungal Disease',
      symptoms: 'Circular spots with gray centers and dark borders',
      action: 'Plant resistant varieties and apply foliar fungicide during reproductive growth stages.',
      treatment: [
        'Apply foliar fungicide during reproductive stages',
        'Remove infected plant debris'
      ],
      prevention: [
        'Plant resistant soybean varieties',
        'Practice crop rotation'
      ],
      date: '1, July, 2024',
      uploadedBy: 'Bharat Jhawar',
      partScanned: 'Leaf',
      image: grass
    }
  ];