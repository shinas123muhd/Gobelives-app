export default function TourInfoCard({features = []}) {
  
    return (
      <div className="  flex items-center w-full pt-5 pb-8 font-source-sans">
        <div className="bg-[#0F1B17] rounded-t-3xl p-8  w-full shadow-2xl border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-start gap-3">
                {/* <div className="mt-1 text-[#B3BEBA]">
                  {feature.icon}
                </div> */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#C4CDCA] font-medium ">{feature.name}</h3>
                  <p className="text-[#F2EEE2] text-sm ">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }