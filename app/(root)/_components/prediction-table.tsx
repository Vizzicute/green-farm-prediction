import { Predictions } from "@/types";
import { formattedTime } from "@/utils";
import { usePathname } from "next/navigation";

interface iComProps {
  predictions: Predictions[] | undefined;
  adlink?: string;
  adimgurl?: string;
}

const PredictionTable = ({ predictions, adlink, adimgurl }: iComProps) => {
  const pathname = usePathname();
  return (
    <table className="border-collapse w-full text-center text-[10px] overflow-x-scroll no-scrollbar">
      <thead>
        <tr className="bg-primary text-primary-foreground">
          <th className="py-2">Time</th>
          <th>League</th>
          <th>Matches</th>
          <th>Tips</th>
          <th>Scores</th>
          {(pathname === "/" ||
            pathname === "/banker" ||
            pathname === "/dashboard") && <th>Odds</th>}
          {adlink && adimgurl && <th>Bet</th>}
        </tr>
      </thead>
      <tbody>
        {predictions?.map((prediction) => {
          function getTips() {
            let tip = prediction.tip;
            switch (pathname) {
              case "/":
                tip = prediction.tip;
                break;

              case "/banker":
                tip = prediction.tip;
                break;

              case "/basketball":
                tip = prediction.tip;
                break;

              case "/either":
                tip = prediction.either;
                break;

              case "/draw":
                tip = prediction.tip;
                break;

              case "/htft":
                tip = prediction.htft;
                break;

              case "/btts":
                tip = "btts";
                break;

              case "/chance":
                tip = prediction.chance;
                break;

              case "/overs":
                tip = prediction.over;
                break;

              default:
                tip = prediction.tip;
                break;
            }

            return tip;
          }
          return (
            <tr
              key={prediction.id}
              className="text-[12px] odd:bg-background even:bg-secondary border-b"
            >
              <td className="py-2">
                {formattedTime(new Date(prediction.datetime))}
              </td>
              <td className="capitalize">{prediction.league}</td>
              <td>
                {prediction.homeTeam}{" "}
                <strong className="text-primary dark:text-primary-foreground">
                  VS
                </strong>{" "}
                {prediction.awayTeam}
              </td>
              <td>{getTips()}</td>
              <td
                className={
                  prediction.status === "WON" &&
                  (pathname === "/" ||
                    pathname === "/banker" ||
                    pathname === "/dashboard")
                    ? "text-green-600"
                    : prediction.status === "LOST" &&
                        (pathname === "/" ||
                          pathname === "/banker" ||
                          pathname === "/dashboard")
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                {prediction.homescore}:{prediction.awayscore}
              </td>
              {(pathname === "/" ||
                pathname === "/banker" ||
                pathname === "/dashboard") && <td>{prediction.odds}</td>}
              <td>
                {adlink && adimgurl && (
                  <a
                    href={adlink}
                    target="_blank"
                    className="flex items-center justify-center"
                  >
                    <img
                      className="rounded-sm w-10 p-1 bg-gray-200"
                      src={adimgurl}
                      alt="Ad"
                    />
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PredictionTable;
