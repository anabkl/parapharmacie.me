const KEY="parapharmacie_cart";
export const getCart=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
export const saveCart=c=>localStorage.setItem(KEY,JSON.stringify(c));
export const addToCart=(p,qty=1)=>{const c=getCart();const i=c.find(x=>x.id===p.id);if(i)i.qty+=qty;else c.push({...p,qty});saveCart(c)};
export const updateQty=(id,qty)=>saveCart(getCart().map(i=>i.id===id?{...i,qty}:i));
export const cartTotal=()=>getCart().reduce((s,i)=>s+i.price*i.qty,0);
