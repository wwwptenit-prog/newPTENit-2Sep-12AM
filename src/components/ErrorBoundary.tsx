import React, { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in PTENit React component:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = (): void => {
    localStorage.removeItem('ptenit_active_tab');
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070D1B] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 text-3xl font-bold">
              !
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-white">
                অ্যাপ লোড হতে সাময়িক সমস্যা হয়েছে
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                ব্রাউজারের ক্যাশ বা পুরনো সেশনের কারণে এই ত্রুটি হতে পারে। নিচের বাটনে ক্লিক করে রিলোড দিন।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/60 border border-slate-800 rounded-xl text-left text-[11px] font-mono text-red-300 max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                রিলোড দিন (Reload)
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = window.location.pathname;
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                ক্যাশ ক্লিয়ার করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
