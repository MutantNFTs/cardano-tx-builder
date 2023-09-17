jest.spyOn(console, "log").mockImplementation(() => "Avoid console logs");
jest.spyOn(console, "error").mockImplementation(() => "Avoid error logs");
jest.spyOn(console, "warn").mockImplementation(() => "Avoid warn logs");
