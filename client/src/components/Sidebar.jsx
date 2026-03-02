import React from "react";
    
function Sidebar() {
    return (
        <div class="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
  <div class="px-4 py-6">
    <span class="flex grid h-10 w-32 place-content-center  justify-center items-center">
       <img
          src="/src/assets/logoIncognita.png"
          alt="Incognita Logo"
          className="w-52 h-52 object-contain"
        />
    </span>

    <ul class="mt-6 space-y-1">
      <li>
        <a href="/dashboard" class="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Dashboard
        </a>
      </li>

      <li>
        <a href="/usuarios" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
          <p className="ml-4">Usuarios</p>
        </a>
      </li>

      <li>
        <a href="/clientes" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></svg>
          <p className="ml-4">Clientes</p>
        </a>
      </li>
       <li>
        <a href="/campaings" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sticky-note-icon lucide-sticky-note"><path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M15 3v5a1 1 0 0 0 1 1h5"/></svg>
          <p className="ml-4">Campañas</p>
        </a>
      </li>
       <li>
        <a href="/orders" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-newspaper-icon lucide-newspaper"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>
          <p className="ml-4">Ordenes</p>
        </a>
      </li>
       <li>
        <a href="/medios" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio-tower-icon lucide-radio-tower"><path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/><path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"/><circle cx="12" cy="9" r="2"/><path d="M16.2 4.8c2 2 2.26 5.11.8 7.47"/><path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"/><path d="M9.5 18h5"/><path d="m8 22 4-11 4 11"/></svg>
          <p className="ml-4">Medios</p>
        </a>
      </li>
       <li>
        <a href="/evidencias" class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-icon lucide-form"><path d="M4 14h6"/><path d="M4 2h10"/><rect x="4" y="18" width="16" height="4" rx="1"/><rect x="4" y="6" width="16" height="4" rx="1"/></svg>
          <p className="ml-4">Evidencias</p>
        </a>
      </li>
      <li>
        <details class="group [&amp;_summary::-webkit-details-marker]:hidden">
          <summary class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <span class="text-sm font-medium"> Account </span>

            <span class="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </span>
          </summary>

          <ul class="mt-2 space-y-1 px-4">
            <li>
              <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Details
              </a>
            </li>

            <li>
              <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Security
              </a>
            </li>

            <li>
                
              <a href="#" class="w-full rounded-lg px-4 py-2 [text-align:_inherit] text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                Logout
              </a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>

  <div class="sticky inset-x-0 bottom-0 border-t border-gray-100">
    <a href="#" class="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
      <img alt="" src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&amp;fit=crop&amp;q=80&amp;w=1160" class="size-10 rounded-full object-cover"/>

      <div>
        <p class="text-xs text-gray-500">
          <strong class="block font-medium">Eric Frusciante</strong>

          <span> eric@frusciante.com </span>
        </p>
      </div>
    </a>
  </div>
</div>

    );
}

export default Sidebar;