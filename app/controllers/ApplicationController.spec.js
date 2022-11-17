/* eslint-disable no-undef */
const ApplicationController = require('./ApplicationController');
const { NotFoundError } = require("../errors");



describe("ApplicationController", () => {
    describe("#handleGetRoot", () => {
        it("should call res.status(200) and res.json with status and messag ",() =>{

            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
              };

            const applicationController = new ApplicationController();
            applicationController.handleGetRoot(mockRequest,mockResponse);
            


            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "OK",
                message: "BCR API is up and running!",
              });

        
        })
    })

    describe("#handleNotFound", () => {
        it("should call res.status(404) and res.json with error and not found ",() =>{


            const mockRequest = {
                method :'get',
                url: 'abcde.co.id',
            };

            const err = new NotFoundError(mockRequest.method, mockRequest.url);

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
                err
              };

            const applicationController = new ApplicationController();
            applicationController.handleNotFound(mockRequest,mockResponse,);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                  name: err.name,
                  message: err.message,
                  details: err.details,
                }
              });
        })
    })

    describe("#handleError", () =>{
        it("should call res.status(500) and res.json with error  ",() =>{

            const mockErr = {};
            const mockRequest = {};
            const mockNext = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
              };

            const applicationController = new ApplicationController();
            applicationController.handleError(mockErr,mockRequest,mockResponse,mockNext);
            
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {
                    name: mockErr.name,
                    message: mockErr.message,
                    details: mockErr.details || null,
                }
            });
        })
    })

    describe("#getOffsetFromRequest", () =>{
        it("should return the offset from Request  ",() =>{

            const mockRequest = {
                query: {
                    page:1,
                    pageSize:10
                }
            }

            const applicationController = new ApplicationController();
            const offset = applicationController.getOffsetFromRequest(mockRequest);

            expect(offset).toEqual(0);
        })
    })

    describe("#buildPaginationObject", () =>{
        it("should build pagination with object", ()=>{
            const mockRequest = {
                query: {
                    page:1,
                    pageSize:10
                }
            }

            const mockCount = 30;

            const applicationController = new ApplicationController();
            const result= applicationController.buildPaginationObject(mockRequest,mockCount);

            expect(result).toEqual({
                page: 1,
                pageCount: 3,
                pageSize: 10,
                count: 30
            })
        });
    });


});