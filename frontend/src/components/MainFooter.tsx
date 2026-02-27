import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-8 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Coluna 1 */}
        <div className="flex flex-col justify-between">
          
          {/* Nome da aplicação */}
          <Link
            to="/"
            className="text-white text-2xl font-semibold tracking-tight hover:text-gray-300 transition mb-2"
          >
            Shelfjolt
          </Link>

          {/* Copyright */}
          <p className="text-sm">
            © 2020 Landify UI Kit. Todos os direitos reservados.
          </p>

          {/* Redes sociais */}
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-white transition">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Empresa */}
        <div>
          <h3 className="text-white font-semibold mb-4">Empresa</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Sobre nós</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
            <li><a href="#" className="hover:text-white">Opiniões</a></li>
          </ul>
        </div>

        {/* Suporte */}
        <div>
          <h3 className="text-white font-semibold mb-4">Suporte</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Central de ajuda</a></li>
            <li><a href="#" className="hover:text-white">Termos & Serviços</a></li>
            <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Atualize-se</h3>
          <div className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <input
              type="email"
              placeholder="Seu endereço de e-mail"
              className="bg-transparent px-4 py-2 flex-1 outline-none text-sm"
            />
            <button className="bg-gray-700 px-4 hover:bg-gray-600 transition">
              ➤
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* por Favor antes de usar o codigo 
Utilizar o comando (npm install lucide-react) 
para fucionar*/