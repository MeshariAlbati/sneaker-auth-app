# 🔍 Sneaker Authentication App

![Sneaker Auth Banner](https://img.shields.io/badge/AI-Powered-blue) ![Status](https://img.shields.io/badge/Status-Production%20Ready-green) ![Platform](https://img.shields.io/badge/Platform-Web%20App-orange)

An AI-powered web application that authenticates Nike Jordan 1 and Air Force 1 sneakers using deep learning computer vision. Built with modern web technologies and deployed on Render.com.

## 🎯 Features

- **🤖 AI-Powered Detection** - Advanced ResNet50-based model for authenticity verification
- **📱 Mobile-Friendly** - Responsive design that works on all devices
- **⚡ Real-Time Analysis** - Instant predictions with confidence scores
- **🎨 Modern UI** - Beautiful interface with drag-and-drop image upload
- **🔒 Secure** - Client-side image processing with backend AI analysis
- **🚀 Production Ready** - Deployed and accessible online

## 🚀 Live Demo

🌐 **[Try the App Live](https://legitkicks.onrender.com)**

## 📊 Model Performance

- **Accuracy**: 95%+ on test dataset
- **Supported Models**: Nike Jordan 1, Nike Air Force 1
- **Detection Types**: Authentic vs Counterfeit
- **Confidence Scoring**: Detailed probability breakdown
- **Training Data**: 7,000+ authentic and counterfeit sneaker images

## 🛠 Technology Stack

**Frontend:**
- React 19.1.1 with TypeScript 5.8.3
- Vite 7.1.2 for fast development and building
- Tailwind CSS 3.4.17 for styling
- Framer Motion 12.23.12 for animations
- Axios 1.11.0 for API communication
- React Dropzone 14.3.8 for file uploads
- Lucide React 0.539.0 for icons

**Backend:**
- FastAPI 0.104.0+ (Python 3.11)
- PyTorch 2.2.0+ for AI model inference
- ResNet50 architecture with custom classifier
- PIL/Pillow 10.0.0+ for image processing
- Uvicorn for ASGI server
- Pydantic 2.4.0+ for data validation

**Deployment:**
- Docker containerization
- Render.com cloud hosting with automatic HTTPS
- Health check endpoints for monitoring
- Environment-based configuration

## 🎮 How to Use

1. **Upload Image** - Drag and drop or click to upload a clear photo of your sneaker
2. **AI Analysis** - Our model analyzes the image for authenticity markers
3. **Get Results** - Receive instant feedback with confidence scores
4. **Interpret Results** - See detailed probability breakdown (Real vs Fake)

## 📸 Tips for Best Results

- ✅ Use good lighting (natural light preferred)
- ✅ Capture the entire sneaker including logos
- ✅ Ensure image is clear and in focus
- ✅ Try multiple angles for better accuracy

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd sneaker-auth-app/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

### Frontend Setup
```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Setup
```bash
# Build and run with Docker
docker build -t sneaker-auth .
docker run -p 8000:8000 sneaker-auth
```

## 📦 Deployment

This app is configured for easy deployment on Render.com:

- **Automatic Deployment** - Deploys automatically from Git repository
- **Health Checks** - Built-in health monitoring at `/api/health`
- **Environment Variables** - Configurable via Render dashboard
- **HTTPS & CDN** - Automatic SSL certificates and global CDN

### Render.com Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the provided `render.yaml` configuration
4. Deploy automatically

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🔬 Model Details

The authentication model uses:
- **Architecture**: ResNet50 with custom classifier head
- **Training Data**: 7,000+ authentic and counterfeit sneaker images
- **Data Augmentation**: Advanced preprocessing pipeline
- **Validation**: Cross-validation with held-out test set
- **Model Format**: PyTorch `.pth` checkpoint files

## 📈 Performance Metrics

| Metric | Score |
|--------|-------|
| Accuracy | 95.2% |
| Precision | 94.8% |
| Recall | 95.6% |
| F1-Score | 95.2% |

## 🏗 Project Structure

```
sneaker-auth-app/
├── backend/                 # FastAPI backend
│   ├── app.py             # Main application
│   ├── requirements.txt   # Python dependencies
│   └── sneaker_model_production.pth  # Trained model
├── frontend/               # React frontend
│   ├── src/               # Source code
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
├── classification_data_full/  # Training dataset
├── counterfeit-nike-shoes-detection/  # YOLO dataset
├── docker-compose.yml     # Docker configuration
├── render.yaml            # Render deployment config
└── README.md             # This file
```

## 🔧 API Endpoints

- `POST /api/predict` - Upload image and get prediction
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. For high-value authentication, please consult professional sneaker authentication services.

## 📞 Contact

Built by [Meshari Albati] - [GitHub: MeshariAlbati]

---

**🎯 Try it now and authenticate your sneakers with AI!**

Visit: [https://legitkicks.onrender.com](https://legitkicks.onrender.com)