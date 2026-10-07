import { X, CheckCircle, PhoneCall, ShieldCheck, Wrench } from 'lucide-react';
import { ServiceItem, CONTACT_INFO } from '../data/websiteData';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  if (!service) return null;

  const waMessage = encodeURIComponent(
    `Halo PT Kusuma Gemilang Raya, saya ingin konsultasi dan pesan layanan *${service.title}* di area Bekasi. Mohon info ketersediaan armada dan estimasi biaya.`
  );
  const waUrl = `${CONTACT_INFO.whatsappUrl}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white flex items-center justify-between">
          <div>
            <div className="inline-block px-3 py-1 mb-2 text-xs font-bold rounded-full bg-[#00C2CB]/20 text-[#00C2CB] border border-[#00C2CB]/30">
              {service.badge}
            </div>
            <h3 className="text-2xl font-bold text-white">{service.title}</h3>
            <p className="text-sm text-cyan-200 mt-1">Layanan Resmi PT Kusuma Gemilang Raya</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#0A192F]">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#00C2CB] mb-2">Deskripsi Layanan</h4>
            <p className="text-slate-600 leading-relaxed text-base">
              {service.detailedDesc}
            </p>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A192F] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00C2CB]" /> Keunggulan Penanganan Kami:
            </h4>
            <ul className="space-y-2.5">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#E0F7F9]/50 rounded-2xl border border-[#00C2CB]/30">
            <Wrench className="w-5 h-5 text-[#00C2CB] shrink-0" />
            <div className="text-xs text-slate-700">
              <strong className="text-[#0A192F] block">Peralatan & Armada Khusus:</strong>
              {service.equipment}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            ⚡ Siaga 24 Jam • Respon WhatsApp Cepat
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-slate-600 hover:bg-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-source="service_detail_modal"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              Pesan Layanan via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
