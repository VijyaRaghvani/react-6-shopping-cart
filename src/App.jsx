import { useState, useEffect } from 'react'
export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=12').then(r => r.json()).then(setProducts).catch(() => setError('Failed to load products'))
  }, [])
  const add = p => setCart({ ...cart, [p.id]: { p, qty: (cart[p.id]?.qty || 0) + 1 } })
  const change = (id, d) => {
    const qty = cart[id].qty + d; const c = { ...cart }
    qty <= 0 ? delete c[id] : (c[id] = { ...c[id], qty }); setCart(c)
  }
  const items = Object.values(cart)
  const total = items.reduce((a, { p, qty }) => a + p.price * qty, 0)
  const shown = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="wide">
      <div className="top"><h1>Shop</h1><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." /></div>
      {error && <p className="err">{error}</p>}
      <div className="grid">{shown.map(p => (
        <div className="card" key={p.id}><img src={p.image} alt={p.title} /><b>{p.title.slice(0, 40)}</b>
          <span>${p.price}</span><button onClick={() => add(p)}>Add to cart</button></div>))}</div>
      <h2>Cart ({items.length})</h2>
      {items.map(({ p, qty }) => (
        <div className="top" key={p.id}><span>{p.title.slice(0, 40)}</span>
          <span><button className="alt" onClick={() => change(p.id, -1)}>-</button> {qty} <button className="alt" onClick={() => change(p.id, 1)}>+</button> ${(p.price * qty).toFixed(2)}</span></div>))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  )
}
