const DashboardCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };

export default DashboardCard;