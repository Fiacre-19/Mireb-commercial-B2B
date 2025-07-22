// =========================================================
//  ADMIN AVEC CRM
// =========================================================
function AdminInterface({ produits, setProduits, onLogout }) {
  /* ----------- états ----------- */
  const [tab, setTab] = useState("produits");          // produits | leads
  const [leads] = useState(() =>
    JSON.parse(localStorage.getItem("mirebLeads") || "[]")
  ); // lecture une seule fois

  /* ----------- produit form ----------- */
  const [nom, setNom]           = useState("");
  const [prix, setPrix]         = useState("");
  const [stock, setStock]       = useState("");
  const [categorie, setCateg]   = useState(CATEGORIES[0]);
  const [images, setImages]     = useState("");
  const [description, setDesc]  = useState("");

  const addProduct = () => {
    const newP = {
      id: Date.now(),
      nom,
      prix: Number(prix),
      stock: Number(stock),
      categorie,
      images: images.split(",").map(x => x.trim()).filter(Boolean) ||
              ["https://via.placeholder.com/600x400?text=No+Image"],
      description
    };
    setProduits([...produits, newP]);
    setNom(""); setPrix(""); setStock(""); setImages(""); setDesc("");
  };
  const delProduct = id => setProduits(produits.filter(p => p.id !== id));

  /* ----------- rendu ----------- */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* header */}
      <header className="bg-red-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Mireb</h1>
        <button onClick={onLogout} className="bg-white text-red-600 px-3 py-1 rounded text-sm">
          Déconnexion
        </button>
      </header>

      {/* onglets */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setTab("produits")}
          className={`flex-1 py-2 ${tab === "produits" ? "border-b-2 border-red-600 text-red-600" : ""}`}
        >
          Produits
        </button>
        <button
          onClick={() => setTab("leads")}
          className={`flex-1 py-2 ${tab === "leads" ? "border-b-2 border-red-600 text-red-600" : ""}`}
        >
          CRM Leads <span className="ml-1 bg-red-100 text-red-700 px-1.5 rounded-full text-xs">{leads.length}</span>
        </button>
      </div>

      {/* contenu onglet produits */}
      {tab === "produits" && (
        <div className="p-4 grid gap-6">
          {/* formulaire ajout */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">Ajouter / Modifier produit</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} className="border px-2 py-1 rounded"/>
              <input type="number" placeholder="Prix" value={prix} onChange={e => setPrix(e.target.value)} className="border px-2 py-1 rounded"/>
              <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="border px-2 py-1 rounded"/>
              <select value={categorie} onChange={e => setCateg(e.target.value)} className="border px-2 py-1 rounded">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea placeholder="URLs images (virgules)" value={images} onChange={e => setImages(e.target.value)} className="border px-2 py-1 rounded md:col-span-2" rows="2"/>
              <textarea placeholder="Description (HTML autorisé)" value={description} onChange={e => setDesc(e.target.value)} className="border px-2 py-1 rounded md:col-span-2" rows="3"/>
            </div>
            <button onClick={addProduct} className="mt-3 bg-orange-600 text-white px-4 py-1 rounded">Ajouter</button>
          </div>

          {/* tableau produits */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">Produits</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-1">Nom</th><th>Prix</th><th>Stock</th><th></th></tr></thead>
              <tbody>{produits.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="p-1">{p.nom}</td>
                  <td className="p-1">{p.prix}</td>
                  <td className="p-1">{p.stock}</td>
                  <td className="p-1"><button onClick={() => delProduct(p.id)} className="text-red-600"><i className="fas fa-trash"></i></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* contenu onglet CRM */}
      {tab === "leads" && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3">Leads collectés</h2>
          {leads.length === 0 ? (
            <p className="text-gray-500">Aucun lead pour le moment.</p>
          ) : (
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Produit</th>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Téléphone</th>
                    <th className="p-2 text-left">Message</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{l.produit}</td>
                      <td className="p-2">{l.nom}</td>
                      <td className="p-2">{l.tel}</td>
                      <td className="p-2 max-w-xs truncate">{l.message}</td>
                      <td className="p-2 text-gray-600">{new Date(l.date).toLocaleString()}</td>
                      <td className="p-2 flex space-x-2">
                        <a href={`tel:${l.tel}`} className="text-blue-600 hover:underline" title="Appeler">
                          <i className="fas fa-phone"></i>
                        </a>
                        <a href={`https://wa.me/${l.tel.replace(/[^0-9]/g, "")}?text=Bonjour ${l.nom}, concernant ${l.produit}...`}
                           target="_blank" rel="noopener noreferrer"
                           className="text-green-600 hover:underline" title="WhatsApp">
                          <i className="fab fa-whatsapp"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
