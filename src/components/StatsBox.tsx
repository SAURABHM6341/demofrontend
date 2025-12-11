import { Package, Users, TrendingUp, Globe } from "lucide-react";

export default function StatsBox() {
  return (
    <div className="w-full">
      {/* Stats Section - Red Box with White Text */}
      <div className="bg-[#ed3a40] rounded-2xl w-full pb-12 px-3 md:px-8">
        {/* Header - Numbers That Matter */}
        <div className="text-center">
          <h2 className="text-3xl text-white md:text-4xl py-10 font-bold">
            Cargo Matters By the Numbers
          </h2>
        </div>
        {/* Stats - Horizontal Layout */}
        <div className="flex flex-col md:flex-row pt-4 gap-12 md:gap-32 justify-center items-center md:items-start">
          {/* Stat 1 - Deliveries */}
          <div className="flex flex-col items-center md:items-start">
            <div className="rounded-lg p-3 flex mx-auto text-center items-center justify-center">
              <Users className="text-white w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl md:text-2xl text-center text-red-100">
                350+
              </div>
              <div className="text-red-100 text-base md:text-xl font-small">
                SME Partners
              </div>
            </div>
          </div>

          {/* Stat 2 - Happy Clients */}
          <div className="flex flex-col items-center md:items-start">
            <div className="rounded-lg p-3 flex text-center mx-auto items-center justify-center">
              <TrendingUp className="text-white w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl md:text-2xl text-center text-red-100">
                98%
              </div>
              <div className="text-red-100 text-base text-center md:text-xl font-small">
                Customs Clearance Success Rate
              </div>
            </div>
          </div>

          {/* Stat 3 - Countries Served */}
          <div className="flex flex-col items-center md:items-start">
            <div className="rounded-lg p-3 flex mx-auto items-center justify-center">
              <Globe className="text-white w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl md:text-2xl text-center text-red-100">
                99.5%
              </div>
              <div className="text-red-100 text-base text-center md:text-xl font-small">
                Client Satisfaction
              </div>
            </div>
          </div>

          {/* Stat 4 - Growth Rate */}
          <div className="flex flex-col items-center md:items-start">
            <div className="rounded-lg p-3 mx-auto flex items-center justify-center">
              <Package className="text-white w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl text-center md:text-2xl text-red-100">
                5,000+
              </div>
              <div className="text-red-100 text-base md:text-xl font-small">
                Tons Moved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
