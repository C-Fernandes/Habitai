package com.imd.habitai.mapper;

import com.imd.habitai.dto.response.ReviewResponse;
import com.imd.habitai.model.Review;
import com.imd.habitai.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    ReviewResponse toDTO(Review review);

    ReviewResponse.AuthorDTO toAuthorDTO(User user);
}