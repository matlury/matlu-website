import React from "react";
import { render } from "@testing-library/react";
import CalendarEvent from "../../components/CalendarEvent";
import ChakraProvider from "../../components/ChakraProvider";

describe(`CalendarEvent`, () => {
  it(`renders siteTitle`, () => {
    const title_fi = "Testi";
    const title_en = "Test";
    const loc = "Helsinki";
    const startDate = "2020-03-13T15:00:00.000Z";
    const { getByText } = render(
      <ChakraProvider>
        <CalendarEvent
          description={{ fi: "Kuvaus", en: "Description" }}
          event_link="https://example.com"
          hide_location
          language="fi"
          latitude={null}
          longitude={null}
          organizer_name="Matlu"
          price="0€"
          start_date={startDate}
          title={{
            en: title_en,
            fi: title_fi,
          }}
          location={{
            en: loc,
            fi: loc,
          }}
        />
      </ChakraProvider>,
    );

    const titleFi = getByText(title_fi);
    expect(titleFi).toBeInTheDocument();
  });
});
