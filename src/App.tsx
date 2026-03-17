import { useState, useEffect } from 'react';
import { Mail, Sparkles, Copy, Check, Download, Info, Moon, Sun, Youtube, MessageCircle } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [variations, setVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(50);
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'outlook'>('gmail');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const generateVariations = (inputEmail: string, count: number): string[] => {
    const emailPattern = /^([^@]+)@(.+)$/;
    const match = inputEmail.match(emailPattern);

    if (!match) return [];

    const [, username, domain] = match;
    const cleanUsername = username.replace(/\./g, '');

    if (cleanUsername.length < 2) return [];

    const variations = new Set<string>();

    variations.add(`${cleanUsername}@${domain}`);

    const generateWithDots = (str: string, currentPos: number, current: string, dots: number) => {
      if (currentPos === str.length) {
        if (dots > 0) {
          variations.add(`${current}@${domain}`);
        }
        return;
      }

      generateWithDots(str, currentPos + 1, current + str[currentPos], dots);

      if (currentPos < str.length - 1 && dots < Math.min(str.length - 1, 15)) {
        generateWithDots(str, currentPos + 1, current + str[currentPos] + '.', dots + 1);
      }
    };

    generateWithDots(cleanUsername, 0, '', 0);

    const result = Array.from(variations);
    return result.slice(0, Math.min(count, result.length));
  };

  const handleGenerate = () => {
    if (!email) return;

    setIsGenerating(true);
    setCopiedIndex(null);

    setTimeout(() => {
      let emailToUse = email;
      if (!email.includes('@')) {
        emailToUse = `${email}@${emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}`;
      }
      const generated = generateVariations(emailToUse, quantity);
      setVariations(generated);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadAsText = () => {
    const content = variations.join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `email-variations-${new Date().toISOString().slice(0, 10)}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCreditsClick = () => {
    window.open('https://discord.gg/DahJn7RJQh', '_blank');
    window.open('https://www.youtube.com/@MysticLand-u8z', '_blank');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-300'} animate-theme-float`}
        aria-label="Alternar tema"
      >
        {isDarkMode ? <Sun className="w-6 h-6 animate-spin-slow" /> : <Moon className="w-6 h-6 animate-pulse" />}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob`}></div>
        <div className={`absolute top-40 right-10 w-72 h-72 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-200'} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-8 left-1/2 w-72 h-72 ${isDarkMode ? 'bg-pink-600' : 'bg-pink-200'} rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000`}></div>
        <div className={`absolute top-1/2 -left-20 w-96 h-96 ${isDarkMode ? 'bg-blue-700' : 'bg-blue-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-blue-500 to-purple-500' : 'from-blue-400 to-purple-400'} rounded-full blur-xl opacity-40 animate-pulse`}></div>
              <Mail className={`w-16 h-16 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-float relative`} />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          <h1 className={`text-6xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 via-purple-400 to-pink-400' : 'from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent mb-2 drop-shadow-lg animate-gradient`}>
            LZ Generator Mail
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium`}>
            Gere variações únicas do seu email com pontos
          </p>
        </div>

        {!variations.length && (
          <div className="max-w-3xl mx-auto mb-8 animate-fade-in-slow">
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-blue-900 border-blue-500' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} rounded-2xl p-6 border-2 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
              <div className="flex gap-4">
                <Info className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-0.5 animate-pulse`} />
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2 text-lg`}>Como Funciona?</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-2`}>
                    O email original que você colocar será o seu <strong>email base</strong>. Quando clicar em <strong>Generate</strong>, o sistema irá gerar diversas combinações únicas do mesmo email, adicionando pontos em diferentes posições do nome de usuário.
                  </p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-2`}>
                    Por exemplo: <span className={`font-mono ${isDarkMode ? 'bg-gray-900 text-blue-400' : 'bg-white text-blue-600'} px-2 py-1 rounded text-sm`}>lzgroup.dc@{emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}</span> pode se tornar:
                  </p>
                  <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-3 mb-2 space-y-1 text-sm`}>
                    <p className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>l.zgr.oup.dc@{emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}</p>
                    <p className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>lz.gro.up.dc@{emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}</p>
                    <p className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>l.z.g.r.o.u.p.d.c@{emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}</p>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>
                    Quando receber um email em qualquer uma dessas variações, você saberá que é para você, pois todas retornam ao seu email principal! Nenhuma combinação se repetirá.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/40'} backdrop-blur-lg rounded-2xl shadow-2xl p-8 border transform transition-all duration-300 hover:shadow-3xl card-glow`}>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
                  Escolha o Provedor de Email
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEmailProvider('gmail')}
                    className={`relative overflow-hidden p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      emailProvider === 'gmail'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Gmail
                    </span>
                    {emailProvider === 'gmail' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 animate-pulse opacity-30"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setEmailProvider('outlook')}
                    className={`relative overflow-hidden p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      emailProvider === 'outlook'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Outlook
                    </span>
                    {emailProvider === 'outlook' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse opacity-30"></div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
                  Seu Email Principal
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} animate-pulse`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`lzgroup.dc@${emailProvider === 'gmail' ? 'gmail.com' : 'outlook.com'}`}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-500/30'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-4 outline-none transition-all duration-300 text-lg font-medium shadow-sm hover:shadow-md`}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
                  Quantidade de Variações
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    id="quantity"
                    min="10"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className={`flex-1 h-3 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-purple-400'} rounded-lg appearance-none cursor-pointer accent-blue-600`}
                  />
                  <div className={`bg-gradient-to-r ${isDarkMode ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} text-white px-4 py-2 rounded-lg font-bold text-center min-w-16 shadow-lg animate-pulse`}>
                    {quantity}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!email || isGenerating}
                className={`w-full ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg button-glow relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gerando Variações...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 animate-sparkle" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {variations.length > 0 && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/40'} backdrop-blur-lg rounded-2xl shadow-2xl p-8 border`}>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                    {variations.length} Variações Geradas
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Email base: <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{email}</span>
                  </p>
                </div>
                <button
                  onClick={downloadAsText}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 download-btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                  <Download className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Download .txt</span>
                </button>
              </div>

              <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {variations.map((variant, index) => (
                  <div
                    key={index}
                    className={`group ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-gray-700 to-blue-900 hover:from-blue-800 hover:to-purple-800 border-gray-600 hover:border-blue-500'
                        : 'bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-100 hover:to-purple-100 border-gray-200 hover:border-blue-400'
                    } p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between animate-fade-in-item shadow-sm hover:shadow-md transform hover:scale-102`}
                    style={{ animationDelay: `${index * 15}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-mono text-sm flex-1 break-all font-medium`}>
                        {variant}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(variant, index)}
                      className={`ml-4 p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-800 hover:bg-blue-700' : 'bg-white hover:bg-blue-200'
                      } transition-all duration-200 flex-shrink-0 group-hover:scale-125 shadow-sm hover:shadow-md`}
                      title="Copiar"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5 text-green-500 animate-pulse" />
                      ) : (
                        <Copy className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleCreditsClick}
            className={`${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            } text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 credits-btn relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
            <MessageCircle className="w-6 h-6 animate-bounce relative z-10" />
            <span className="relative z-10">Créditos</span>
            <Youtube className="w-6 h-6 animate-pulse relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
