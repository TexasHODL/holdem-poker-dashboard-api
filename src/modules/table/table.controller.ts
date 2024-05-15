import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
} from "@nestjs/common";
import { TableService } from "./table.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { ListTableDto } from "./dto/listTableDto";

@Controller("")
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post("listTable")
  listTable(@Body() dto: ListTableDto) {
    return this.tableService.listTable(dto);
  }

  @Post("createTable")
  createTable(@Body() dto: CreateTableDto) {
    return this.tableService.createTable(dto);
  }

  @Put("updateTable")
  updateTable(@Body() dto, @Req() req) {
    const ip = req.connection.remoteAddress.substring(
      req.connection.remoteAddress.lastIndexOf(":") + 1
    );
    const device = req.header("user-agent");
    return this.tableService.updateTable(dto, ip, device);
  }

  @Put("disableTable")
  disableTable(@Body() dto) {
    return this.tableService.disableTable(dto);
  }

  @Post("countlistTable")
  countlistTable(@Body() dto) {
    return this.tableService.countlistTable(dto);
  }

  @Post("revertTable")
  revertTable(@Body() dto) {
    return this.tableService.revertTable(dto);
  }

  @Post("getTableUpdateRecords")
  getTableUpdateRecords(@Body() dto) {
    return this.tableService.findTableUpdateRecords(dto);
  }

  @Post("getTableRecords")
  getTableRecords(@Body() dto) {
    return this.tableService.findTableRecords(dto);
  }

  @Post("getTableUpdateRecordsCount")
  getTableUpdateRecordsCount(@Body() dto) {
    return this.tableService.countTableUpdateRecords(dto);
  }

  // @Get()
  // findAll() {
  //   return this.tableService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tableService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
  //   return this.tableService.update(+id, updateTableDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tableService.remove(+id);
  // }
}
