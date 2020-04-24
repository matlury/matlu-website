import React from "react";
import { render } from "@testing-library/react";
import CalendarEvent from "../CalendarEvent";

describe(`CalendarEvent`, () => {
  it(`renders siteTitle`, () => {
    const title_fi = "Testi";
    const title_en = "Test";
    const loc = "Helsinki";
    const startDate = "2020-03-13T15:00:00.000Z";
    const { getByText } = render(
      <CalendarEvent
        event_link="https://example.com"
        hide_location
        language="fi"
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
    );

    const titleFi = getByText(title_fi);
    expect(titleFi).toBeInTheDocument();
  });
});
