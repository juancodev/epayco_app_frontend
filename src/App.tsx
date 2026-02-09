import { useState } from 'react'
import { ViewState } from '../types'
import { RegisterView } from '../src/components/views/RegisterView'

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.REGISTER);

  const renderView = () => {
    switch (currentView) {
      case ViewState.REGISTER:
        return <RegisterView />;
      case ViewState.RECHARGE:
        return <RechargeView />;
      case ViewState.PAY:
        return <PaymentView />;
      case ViewState.BALANCE:
        return <BalanceView />;
      default:
        return <RegisterView />;
    }
  };

  const NavButton = ({
    view,
    label,
    icon,
  }: {
    view: ViewState;
    label: string;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-full sm:w-auto ${
        currentView === view
          ? "bg-orange-600 text-white shadow-lg scale-105"
          : "bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      {/* Header / Logo Area */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          ePayco<span className="text-orange-600">Wallet</span>
        </h1>
        <p className="text-gray-500 mt-2">Simulación Prueba Técnica</p>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-lg mb-24 sm:mb-8">{renderView()}</main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg sm:static sm:w-max sm:border-none sm:shadow-none sm:bg-transparent sm:mt-4">
        <div className="flex justify-around sm:justify-center sm:gap-4 p-2 max-w-md mx-auto sm:max-w-none">
          <NavButton
            view={ViewState.REGISTER}
            label="Registro"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            }
          />

          <NavButton
            view={ViewState.RECHARGE}
            label="Recargar"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
          />

          <NavButton
            view={ViewState.PAY}
            label="Pagar"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />

          <NavButton
            view={ViewState.BALANCE}
            label="Saldo"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </nav>
    </div>
  );
}

export default App
